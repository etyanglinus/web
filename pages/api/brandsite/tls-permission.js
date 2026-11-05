export default async function permission(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const domain = req.query.domain;
  const secret = process.env.BRANDSITE_INGRESS_SECRET || '';
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  if (req.method !== 'GET' || typeof domain !== 'string' || !/^[a-z0-9.-]{1,233}$/.test(domain) || secret.length < 32 || !base) {
    res.status(403).end();
    return;
  }
  try {
    const response = await fetch(`${base}/api/v1/brandsite-host/${domain}?purpose=certificate`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${secret}` }, redirect: 'error', signal: AbortSignal.timeout(3000),
    });
    res.status(response.ok ? 200 : 403).end();
  } catch {
    res.status(403).end();
  }
}
