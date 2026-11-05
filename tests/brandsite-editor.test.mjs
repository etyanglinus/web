import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const source = await readFile(new URL("../pages/api/brandsite/editor.js", import.meta.url), "utf8");
const { default: editor } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
process.env.BRANDSITE_WEB_ORIGIN = "https://web.example.test";
process.env.NEXT_PUBLIC_BASE_URL = "https://admin.example.test";

function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
    end() { return this; },
  };
}

test("rejects cross-origin editor writes and requests without a session", async () => {
  const crossOrigin = response();
  await editor({ method: "POST", headers: { origin: "https://other.example.test" } }, crossOrigin);
  assert.equal(crossOrigin.statusCode, 403);
  const unauthenticated = response();
  await editor({ method: "GET", headers: {}, cookies: {} }, unauthenticated);
  assert.equal(unauthenticated.statusCode, 401);
});

test("launch exchange sets a protected cookie and withholds the token from JavaScript", async (context) => {
  const token = "a".repeat(64);
  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://admin.example.test/api/v1/brandsite/editor/session");
    assert.equal(options.redirect, "error");
    return Response.json({ token });
  });
  const res = response();
  await editor({
    method: "POST",
    headers: { origin: "https://web.example.test" },
    query: { action: "session" },
    cookies: {},
    body: { code: "b".repeat(64) },
  }, res);
  assert.equal(res.statusCode, 204);
  assert.equal(res.payload, undefined);
  assert.match(res.headers["Set-Cookie"], /HttpOnly; Secure; SameSite=Strict/);
  assert.equal(res.headers["Cache-Control"], "private, no-store");
});

test("forwards a session to Admin and preserves a stale-revision conflict", async (context) => {
  const token = "c".repeat(64);
  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://admin.example.test/api/v1/brandsite/editor/state");
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    return Response.json({ message: "Reload BrandSite before saving." }, { status: 409 });
  });
  const res = response();
  await editor({
    method: "POST",
    headers: { origin: "https://web.example.test" },
    query: {},
    cookies: { fasta_brandsite_editor: token },
    body: { revision: 1 },
  }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.payload.message, "Reload BrandSite before saving.");
});

test("unwraps the Admin envelope during session exchange", async (context) => {
  context.mock.method(globalThis, "fetch", async () => Response.json({ identical_code: "default_200", content: {token: "a".repeat(64)}, errors: [] }));
  const res = response();
  await editor({method: "POST", headers: {origin: "https://web.example.test"}, query: {action: "session"}, cookies: {}, body: {code: "b".repeat(64)}}, res);
  assert.equal(res.statusCode, 204);
  assert.match(res.headers["Set-Cookie"], /Secure/);
});

test("HTTP editor cookies are limited to loopback development", async (context) => {
  const previous = process.env.NODE_ENV;
  const origin = process.env.BRANDSITE_WEB_ORIGIN;
  try {
    process.env.NODE_ENV = "development";
    process.env.BRANDSITE_WEB_ORIGIN = "http://127.0.0.1:3016";
    context.mock.method(globalThis, "fetch", async () => Response.json({token: "a".repeat(64)}));
    const req = {method: "POST", headers: {origin: process.env.BRANDSITE_WEB_ORIGIN}, query: {action: "session"}, cookies: {}, body: {code: "b".repeat(64)}};
    const local = response();
    await editor(req, local);
    assert.equal(local.statusCode, 204);
    assert.doesNotMatch(local.headers["Set-Cookie"], /Secure/);
    process.env.NODE_ENV = "production";
    const production = response();
    await editor(req, production);
    assert.equal(production.statusCode, 503);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous;
    process.env.BRANDSITE_WEB_ORIGIN = origin;
  }
});
