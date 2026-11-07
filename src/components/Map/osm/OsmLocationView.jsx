/**
 * OpenStreetMap (Leaflet) version of Map/location-view/MapComponent: shows the delivery location,
 * the store or delivery person, and the route between them. Same props as the Google version.
 *
 * The route line comes from the backend (/api/v1/config/direction-api), which answers from Google
 * or, when Google is unavailable, from OpenStreetMap routing, so no Google script is needed here.
 */
import React, { useEffect, useRef, useState } from "react";
import { alpha, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MainApi from "../../../api-manage/MainApi";
import { useMapProvider } from "./mapProvider";

const toNum = (v) => (v === null || v === undefined || v === "" ? NaN : parseFloat(v));
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Decodes Google's encoded polyline format (also used by OSRM). */
export function decodePolyline(str) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  const next = () => {
    let b, shift = 0, result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20 && index < str.length);
    return result & 1 ? ~(result >> 1) : result >> 1;
  };
  while (index < str.length) {
    lat += next();
    lng += next();
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

const OsmLocationView = (props) => {
  const {
    latitude, longitude, deliveryManLat, deliveryManLng, isStore, isFooter,
    store, deliveryMan, receiver, resAddress, userAddress,
  } = props;
  const theme = useTheme();
  const { tileUrl, attribution, maxZoom } = useMapProvider();
  const [container, setContainer] = useState(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const layerRef = useRef(null);
  const [ready, setReady] = useState(0);

  const lat = toNum(latitude), lng = toNum(longitude);
  const dLat = toNum(deliveryManLat), dLng = toNum(deliveryManLng);
  const hasCenter = Number.isFinite(lat) && Number.isFinite(lng);
  const hasOther = Number.isFinite(dLat) && Number.isFinite(dLng) && !(dLat === 0 && dLng === 0);

  const startName = receiver?.contact_person_name || receiver?.contact_person || "Delivery Location";
  const personName = `${deliveryMan?.f_name || ""} ${deliveryMan?.l_name || ""}`.trim() || "Delivery Man";
  const otherName = deliveryMan ? personName : isStore ? store?.name || "Store Location" : receiver?.contact_person_name || receiver?.contact_person || "Store Location";

  useEffect(() => {
    if (!container) return undefined;
    let cancelled = false;
    let created = null;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      leafletRef.current = L;
      const map = L.map(container, { zoomControl: false }).setView(hasCenter ? [lat, lng] : hasOther ? [dLat, dLng] : [-1.2864, 36.8172], 15);
      L.tileLayer(tileUrl, { maxZoom, attribution }).addTo(map);
      map.attributionControl.setPrefix(false);
      layerRef.current = L.layerGroup().addTo(map);
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

  // Markers, route and viewport whenever the positions change (e.g. live delivery tracking).
  useEffect(() => {
    const map = mapRef.current, L = leafletRef.current, layer = layerRef.current;
    if (!map || !L || !layer) return undefined;
    layer.clearLayers();
    let cancelled = false;

    const meeting = L.icon({ iconUrl: "/meeting-point.svg", iconSize: [40, 40], iconAnchor: [20, 38], popupAnchor: [0, -34] });
    const courier = L.icon({ iconUrl: "/delivery_man_marker.png", iconSize: [40, 40], iconAnchor: [20, 38], popupAnchor: [0, -34] });
    const popup = (title, text) => `<strong>${esc(title)}</strong><br/><span style="font-size:12px">${esc(text)}</span>`;

    if (hasCenter) {
      L.marker([lat, lng], { icon: meeting })
        .bindPopup(popup(startName, userAddress || `lat: ${latitude} - lng: ${longitude}`))
        .addTo(layer);
    }
    if (hasOther && !isFooter) {
      L.marker([dLat, dLng], { icon: courier })
        .bindPopup(popup(otherName, resAddress || `lat: ${deliveryManLat} - lng: ${deliveryManLng}`))
        .addTo(layer);
    }

    if (hasCenter && hasOther && !isFooter) {
      map.fitBounds(L.latLngBounds([[lat, lng], [dLat, dLng]]), { padding: [40, 40], maxZoom: 16 });
      const color = theme.palette.primary.main;
      const straight = L.polyline([[dLat, dLng], [lat, lng]], { color, weight: 3, dashArray: "6 8", opacity: 0.7 }).addTo(layer);
      MainApi.get(`/api/v1/config/direction-api?origin_lat=${dLat}&origin_lng=${dLng}&destination_lat=${lat}&destination_lng=${lng}&mode=DRIVE`)
        .then((res) => {
          if (cancelled) return;
          const body = res?.data?.content ?? res?.data;
          const encoded = body?.routes?.[0]?.polyline?.encodedPolyline;
          if (typeof encoded === "string" && encoded.length > 3) {
            layer.removeLayer(straight);
            L.polyline(decodePolyline(encoded), { color, weight: 4, opacity: 0.9 }).addTo(layer);
          }
        })
        .catch(() => { /* keep the straight dashed line */ });
    } else if (hasCenter) {
      map.setView([lat, lng], map.getZoom() || 15);
    } else if (hasOther) {
      map.setView([dLat, dLng], map.getZoom() || 15);
    }
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, latitude, longitude, deliveryManLat, deliveryManLng, isFooter, isStore]);

  const zoomBtnSx = {
    background: (th) => th.palette.neutral?.[100] ?? th.palette.background.paper,
    "&:hover": { background: (th) => alpha(th.palette.neutral?.[100] ?? th.palette.background.paper, 0.8) },
  };

  return (
    <Stack position="relative">
      <Stack position="absolute" zIndex={1001} left="3%" bottom="6%" direction="column" spacing={1}>
        <IconButton sx={zoomBtnSx} onClick={() => mapRef.current?.zoomIn()} aria-label="Zoom in"><AddIcon color="primary" /></IconButton>
        <IconButton sx={zoomBtnSx} onClick={() => mapRef.current?.zoomOut()} aria-label="Zoom out"><RemoveIcon color="primary" /></IconButton>
      </Stack>
      <div
        ref={setContainer}
        style={{
          width: "100%",
          height: "348px",
          borderRadius: "10px",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.10) inset",
          border: "1px solid #EAEEF2",
          zIndex: 0,
        }}
      />
    </Stack>
  );
};

export default OsmLocationView;
