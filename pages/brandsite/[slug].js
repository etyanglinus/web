import BrandSite from "../../src/components/brandsite/BrandSiteRenderer";

export async function getServerSideProps({ params, query, res }) {
  const slug = params.slug;
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug)) return { notFound: true };

  const page = Number(query.page ?? 1);
  if (!Number.isInteger(page) || page < 1 || page > 500) return { notFound: true };

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) throw new Error("BrandSite requires NEXT_PUBLIC_BASE_URL");
  const url = new URL(`${base.replace(/\/+$/, "")}/api/v1/brandsite/${slug}`);
  url.searchParams.set("page", String(page));
  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-localization": "en" },
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 404) return { notFound: true };
  if (!response.ok) throw new Error(`BrandSite catalog returned HTTP ${response.status}`);

  res.setHeader("Cache-Control", "private, no-store");
  const payload = await response.json();
  const catalog = payload && "identical_code" in payload && "content" in payload ? payload.content : payload;
  return { props: { catalog, slug, page } };
}

export default BrandSite;
