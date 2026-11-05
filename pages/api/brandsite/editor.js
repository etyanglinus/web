const COOKIE = "fasta_brandsite_editor";
const tokenPattern = /^[a-f0-9]{64}$/;

export const config = { api: { bodyParser: { sizeLimit: "128kb" } } };

export default async function editor(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const origin = process.env.BRANDSITE_WEB_ORIGIN?.replace(/\/+$/, "");
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (!origin || !base) return res.status(503).json({ message: "BrandSite editor is unavailable." });
  const localHttp = process.env.NODE_ENV === "development" && /^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin);
  if (!origin.startsWith("https://") && !localHttp) {
    return res.status(503).json({ message: "BrandSite editor requires HTTPS." });
  }
  if (req.method === "POST" && req.headers.origin !== origin && !(localHttp && /^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(req.headers.origin || "") && new URL(req.headers.origin).port === new URL(origin).port)) {
    return res.status(403).json({ message: "Invalid editor origin." });
  }

  const exchange = req.method === "POST" && req.query.action === "session";
  const token = req.cookies[COOKIE];
  if (!exchange && !tokenPattern.test(token || "")) {
    return res.status(401).json({ message: "Open the editor from My BrandSite." });
  }
  if (exchange && (typeof req.body?.code !== "string" || !tokenPattern.test(req.body.code))) {
    return res.status(422).json({ message: "Invalid editor launch code." });
  }

  try {
    const upstream = await fetch(`${base}/api/v1/brandsite/editor/${exchange ? "session" : "state"}`, {
      method: req.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(exchange ? {} : { Authorization: `Bearer ${token}` }),
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (upstream.status >= 500) {
      return res.status(502).json({ message: "BrandSite Admin is unavailable." });
    }
    const payload = await upstream.json();
    const result = upstream.ok && payload && "identical_code" in payload && "content" in payload ? payload.content : payload;
    if (!upstream.ok) return res.status(upstream.status).json(result);
    if (!exchange) return res.json(result);
    if (!tokenPattern.test(result.token || "")) {
      return res.status(502).json({ message: "Invalid editor session response." });
    }
    res.setHeader("Set-Cookie", `${COOKIE}=${result.token}; Path=/api/brandsite/editor; HttpOnly;${localHttp ? "" : " Secure;"} SameSite=Strict; Max-Age=900`);
    return res.status(204).end();
  } catch {
    return res.status(502).json({ message: "Could not connect to BrandSite Admin." });
  }
}
