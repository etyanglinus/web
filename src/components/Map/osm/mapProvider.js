/**
 * Which map to draw: "google" or "osm" (OpenStreetMap).
 *
 * OpenStreetMap is used when ANY of these is true:
 *  1. The backend says so (`map_provider: "osm"` from /api/v1/config/map-provider). The backend switches
 *     automatically while Google Maps is failing (billing, quota, rejected key) or when the admin chooses
 *     "Always OpenStreetMap".
 *  2. There is no Google Maps browser key (NEXT_PUBLIC_GOOGLE_MAP_KEY is empty).
 *  3. Google Maps fails in this browser: the script can't load, or Google reports an
 *     authentication/billing problem through `window.gm_authFailure`.
 *
 * Once a browser has seen Google fail, it stays on OpenStreetMap for the rest of the session.
 */
import { useEffect, useSyncExternalStore } from "react";
import MainApi from "../../../api-manage/MainApi";

const DEFAULT_TILES = {
  tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  maxZoom: 19,
};
const SESSION_KEY = "fasta:google-maps-failed";
const RECHECK_MS = 5 * 60 * 1000;

let state = {
  provider: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ? "google" : "osm",
  backendProvider: null,
  googleFailed: false,
  ...DEFAULT_TILES,
};
const listeners = new Set();
let lastFetch = 0;
let inflight = null;

function emit(patch) {
  state = { ...state, ...patch };
  const forceOsm = state.googleFailed || !process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || state.backendProvider === "osm";
  state.provider = forceOsm ? "osm" : "google";
  listeners.forEach((l) => l());
}

/** Called when Google Maps can't be used in this browser. */
export function reportGoogleMapsFailure(reason) {
  if (state.googleFailed) return;
  try { sessionStorage.setItem(SESSION_KEY, String(reason || "failed")); } catch (e) { /* private mode */ }
  // eslint-disable-next-line no-console
  console.warn("Google Maps unavailable, switching to OpenStreetMap:", reason);
  emit({ googleFailed: true });
}

/** Apply map settings from /api/v1/config or /api/v1/config/map-provider. */
export function applyMapProviderConfig(cfg) {
  if (!cfg || typeof cfg !== "object") return;
  const patch = {};
  if (cfg.map_provider === "osm" || cfg.map_provider === "google") patch.backendProvider = cfg.map_provider;
  if (typeof cfg.osm_tile_url === "string" && cfg.osm_tile_url.includes("{z}")) patch.tileUrl = cfg.osm_tile_url;
  if (typeof cfg.osm_tile_attribution === "string" && cfg.osm_tile_attribution) {
    // Keep the required OpenStreetMap credit, with a link, whatever the configured text is.
    patch.attribution = /openstreetmap/i.test(cfg.osm_tile_attribution) && !/<a /i.test(cfg.osm_tile_attribution)
      ? cfg.osm_tile_attribution.replace(/OpenStreetMap/i, '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>')
      : cfg.osm_tile_attribution;
  }
  if (Number.isFinite(Number(cfg.osm_tile_max_zoom))) patch.maxZoom = Number(cfg.osm_tile_max_zoom);
  emit(patch);
}

function refresh() {
  if (inflight || Date.now() - lastFetch < RECHECK_MS) return inflight;
  lastFetch = Date.now();
  inflight = MainApi.get("/api/v1/config/map-provider")
    .then((res) => {
      const body = res?.data;
      applyMapProviderConfig(body?.content ?? body);
    })
    .catch(() => { /* keep the current choice */ })
    .finally(() => { inflight = null; });
  return inflight;
}

if (typeof window !== "undefined") {
  try { if (sessionStorage.getItem(SESSION_KEY)) state = { ...state, googleFailed: true, provider: "osm" }; } catch (e) { /* ignore */ }
  // Google Maps JS calls this global when the key is rejected (invalid key, billing disabled, referrer not allowed).
  const previous = window.gm_authFailure;
  window.gm_authFailure = function () {
    reportGoogleMapsFailure("gm_authFailure");
    if (typeof previous === "function") previous();
  };
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;
const getServerSnapshot = () => state;

/** React hook: { provider: "google" | "osm", tileUrl, attribution, maxZoom }. */
export function useMapProvider() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => { refresh(); }, []);
  return snap;
}
