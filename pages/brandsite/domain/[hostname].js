import { createHmac, timingSafeEqual } from 'node:crypto';
import BrandSite from '../../../src/components/brandsite/BrandSiteRenderer';

export async function getServerSideProps({ params, query, req, res }) {
  const secret = process.env.BRANDSITE_INGRESS_SECRET || '';
  const header = req.headers['x-fasta-ingress'];
  const hostname = params.hostname;
  if (secret.length < 32 || typeof header !== 'string' || Buffer.byteLength(header) !== Buffer.byteLength(secret)
    || !timingSafeEqual(Buffer.from(header), Buffer.from(secret)) || req.headers.host !== hostname
    || !/^[a-z0-9.-]{1,233}$/.test(hostname)) return { notFound: true };
  const page = Number(query.page ?? 1);
  const nonce = query.fasta_domain_check;
  if (!Number.isInteger(page) || page < 1 || page > 500) return { notFound: true };
  const probe = typeof nonce === 'string' && /^[a-f0-9]{48}$/.test(nonce);
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  const marketplaceOrigin = process.env.BRANDSITE_WEB_ORIGIN?.replace(/\/+$/, '');
  if (!base || !marketplaceOrigin?.startsWith('https://')) return { notFound: true };
  const response = await fetch(`${base}/api/v1/brandsite-host/${hostname}?purpose=${probe ? 'probe' : 'serve'}&page=${page}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${secret}` }, redirect: 'error', signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return { notFound: true };
  res.setHeader('Cache-Control', 'private, no-store');
  if (probe) {
    res.setHeader('X-Fasta-Domain-Proof', createHmac('sha256', secret).update(`${hostname}:${nonce}`).digest('hex'));
    res.end();
    return { props: {} };
  }
  const payload = await response.json();
  const catalog = payload.content ?? payload;
  return { props: { catalog, slug: catalog.store.slug, page, marketplaceOrigin } };
}

export default BrandSite;
