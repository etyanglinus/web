/**
 * OpenStreetMap (Leaflet) version of GoogleMapComponent: a "pick a location" map with a fixed
 * centre pin. Same props and the same callbacks, so every screen that uses GoogleMapComponent
 * works unchanged when Google Maps is unavailable.
 */
import React, { useEffect, useRef, useState } from "react";
import { alpha, CircularProgress, IconButton, Modal, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import pickMarker from "../assets/pick_marker.png";
import ModalExtendShrink from "../ModalExtendShrink";
import { useMapProvider } from "./mapProvider";

const toNum = (v) => (v === null || v === undefined || v === "" ? NaN : parseFloat(v));

const OsmLocationPicker = ({
  setDisablePickButton,
  setLocationEnabled,
  setLocation,
  locationLoading,
  location,
  setPlaceDetailsEnabled,
  setPlaceDescription,
  height,
  isModalExpand,
  setIsModalExpand,
  t = (text) => text,
  left,
  bottom,
  polygonPaths,
  fromVendor,
  mapmodal,
  zoomToLocationToken,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { tileUrl, attribution, maxZoom } = useMapProvider();
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = typeof isModalExpand === "boolean" ? isModalExpand : localExpanded;
  const setExpanded = typeof setIsModalExpand === "function" ? setIsModalExpand : setLocalExpanded;

  // Callback ref: expanding into the full-screen popup mounts a NEW container element, and the map
  // must be rebuilt inside it (otherwise it would stay attached to the old, removed element).
  const [container, setContainer] = useState(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const polygonRef = useRef(null);
  const programmaticMove = useRef(false);
  const callbacks = useRef({});
  callbacks.current = { setDisablePickButton, setLocationEnabled, setLocation, setPlaceDetailsEnabled, setPlaceDescription, fromVendor };
  const [ready, setReady] = useState(0);
  const targetZoom = polygonPaths ? 9 : 17;

  const pick = (lat, lng) => {
    const c = callbacks.current;
    c.setDisablePickButton?.(false);
    c.setLocationEnabled?.(true);
    c.setLocation?.({ lat, lng });
    c.setPlaceDetailsEnabled?.(false);
    c.setPlaceDescription?.(undefined);
  };
  const moveTo = (lat, lng, zoom) => {
    const map = mapRef.current;
    if (!map) return;
    programmaticMove.current = true;
    if (zoom !== undefined) map.setView([lat, lng], zoom, { animate: true });
    else map.panTo([lat, lng], { animate: true });
  };

  // Create the map in the current container (Leaflet needs `window`, so it loads in the browser only).
  useEffect(() => {
    if (!container) return undefined;
    let cancelled = false;
    let created = null;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      leafletRef.current = L;
      const lat = toNum(location?.lat);
      const lng = toNum(location?.lng);
      const map = L.map(container, { zoomControl: false, attributionControl: true })
        .setView([Number.isFinite(lat) ? lat : -1.2864, Number.isFinite(lng) ? lng : 36.8172], targetZoom);
      L.tileLayer(tileUrl, { maxZoom, attribution }).addTo(map);
      map.attributionControl.setPrefix(false);

      map.on("movestart", () => {
        if (!programmaticMove.current) callbacks.current.setDisablePickButton?.(true);
      });
      map.on("moveend", () => {
        if (programmaticMove.current) { programmaticMove.current = false; return; }
        const c = map.getCenter();
        pick(c.lat, c.lng);
      });
      map.on("click", (e) => {
        if (callbacks.current.fromVendor) { pick(e.latlng.lat, e.latlng.lng); moveTo(e.latlng.lat, e.latlng.lng); }
      });
      created = map;
      mapRef.current = map;
      setReady((n) => n + 1);
    })();
    return () => {
      cancelled = true;
      created?.remove();
      if (mapRef.current === created) mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  // Zone outline (and tap-to-pick inside it for sellers).
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    polygonRef.current?.remove();
    polygonRef.current = null;
    if (!polygonPaths?.length) return;
    const latlngs = polygonPaths.map((p) => [toNum(p.lat), toNum(p.lng)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
    if (!latlngs.length) return;
    const poly = L.polygon(latlngs, { color: theme.palette.error.main, weight: 2, opacity: 0.8, fillColor: "blue", fillOpacity: 0.3 }).addTo(map);
    poly.on("click", (e) => {
      if (fromVendor) { pick(e.latlng.lat, e.latlng.lng); moveTo(e.latlng.lat, e.latlng.lng); }
    });
    polygonRef.current = poly;
    const lat = toNum(location?.lat);
    const lng = toNum(location?.lng);
    const inside = Number.isFinite(lat) && Number.isFinite(lng) && poly.getBounds().contains([lat, lng]);
    if (!fromVendor || !inside) { programmaticMove.current = true; map.fitBounds(poly.getBounds()); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygonPaths, ready, fromVendor]);

  // Follow location changes made elsewhere (search result, "use my location").
  useEffect(() => {
    const map = mapRef.current;
    const lat = toNum(location?.lat);
    const lng = toNum(location?.lng);
    if (!map || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const c = map.getCenter();
    if (Math.abs(c.lat - lat) < 0.0001 && Math.abs(c.lng - lng) < 0.0001) return;   // already there (user drag)
    moveTo(lat, lng, map.getZoom() < targetZoom ? targetZoom : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lng, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !zoomToLocationToken) return;
    const lat = toNum(location?.lat);
    const lng = toNum(location?.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) moveTo(lat, lng, targetZoom);
    else { programmaticMove.current = true; map.setZoom(targetZoom); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomToLocationToken]);


  // The container changes size when expanded; Leaflet must re-measure it.
  useEffect(() => {
    const id = setTimeout(() => mapRef.current?.invalidateSize(), 200);
    return () => clearTimeout(id);
  }, [expanded, height]);

  const zoomBtnSx = {
    background: (th) => th.palette.neutral?.[100] ?? th.palette.background.paper,
    "&:hover": { background: (th) => alpha(th.palette.neutral?.[100] ?? th.palette.background.paper, 0.8) },
  };

  const content = (
    <Stack
      sx={{
        boxShadow: expanded ? "none" : "inset 0px 4px 4px rgba(0, 0, 0, 0.1)",
        p: "4px",
        position: "relative",
        width: expanded ? "100vw" : "100%",
        height: expanded ? "100dvh" : "auto",
      }}
    >
      <Stack position="absolute" zIndex={1001} left={left || "15px"} bottom={bottom || "6%"} direction="column" spacing={1}>
        <IconButton sx={zoomBtnSx} onClick={() => mapRef.current?.zoomIn()} aria-label={t("Zoom in")}>
          <AddIcon color="primary" />
        </IconButton>
        <IconButton sx={zoomBtnSx} onClick={() => mapRef.current?.zoomOut()} aria-label={t("Zoom out")}>
          <RemoveIcon color="primary" />
        </IconButton>
      </Stack>
      {!mapmodal && (
        <Stack
          position="absolute"
          zIndex={1002}
          sx={{
            right: { xs: "10px", sm: "12px" },
            top: expanded ? { xs: "10px", sm: "12px" } : undefined,
            bottom: expanded ? undefined : { xs: "20px", sm: "80px", md: "70px" },
          }}
        >
          <ModalExtendShrink isModalExpand={expanded} setIsModalExpand={setExpanded} t={t} />
        </Stack>
      )}
      <div
        ref={setContainer}
        style={{
          width: expanded ? "100vw" : "100%",
          maxHeight: expanded ? "100dvh" : "50dvh",
          height: expanded ? "100dvh" : height || (isSmall ? "350px" : "350px"),
          zIndex: 0,
        }}
      />
      {!locationLoading ? (
        <img
          src={pickMarker.src}
          alt=""
          style={{ zIndex: 1000, position: "absolute", marginTop: -63, marginLeft: -32, left: "50%", top: "50%", height: "60px", width: "45px", pointerEvents: "none" }}
        />
      ) : (
        <Stack alignItems="center" style={{ zIndex: 1000, position: "absolute", marginTop: -37, marginLeft: -11, left: "50%", top: "50%" }}>
          <CircularProgress />
        </Stack>
      )}
    </Stack>
  );

  return expanded && !mapmodal ? (
    <Modal open={expanded} onClose={() => setExpanded(false)}>
      <Stack sx={{ width: "100vw", height: "100dvh", backgroundColor: theme.palette.background.paper, outline: "none" }}>{content}</Stack>
    </Modal>
  ) : (
    content
  );
};

export default OsmLocationPicker;
