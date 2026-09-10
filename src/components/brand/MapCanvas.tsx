import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { CARTO_LIGHT_STYLE, MARKER_COLOR, type MapPoint } from "@/lib/maps/carto";

type Props = {
  points: MapPoint[];
  /** Fallback centre when there is nothing to plot. */
  center?: [number, number];
  zoom?: number;
  className?: string;
  interactivePopups?: boolean;
  /** Shows a "back to start" button that returns to this centre and zoom. */
  resetLabel?: string;
};

function exactMarkerEl() {
  const el = document.createElement("div");
  el.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
    <circle cx="11" cy="11" r="9" fill="${MARKER_COLOR}" fill-opacity="0.22" />
    <circle cx="11" cy="11" r="5" fill="${MARKER_COLOR}" />
  </svg>`;
  el.style.cursor = "pointer";
  return el;
}

function areaMarkerEl() {
  const el = document.createElement("div");
  el.style.width = "88px";
  el.style.height = "88px";
  el.style.borderRadius = "9999px";
  el.style.background = `${MARKER_COLOR}26`;
  el.style.border = `1px solid ${MARKER_COLOR}59`;
  el.style.cursor = "pointer";
  return el;
}

function popupHtml(p: MapPoint) {
  const title = p.title ?? "";
  const meta = p.meta ? `<div style="opacity:.7;margin-top:2px">${p.meta}</div>` : "";
  const body = `<div style="font-size:13px;line-height:1.35"><strong>${title}</strong>${meta}</div>`;
  return p.href
    ? `<a href="${p.href}" style="text-decoration:none;color:inherit">${body}</a>`
    : body;
}

/**
 * MapLibre canvas with CARTO raster tiles. Initialised lazily the first
 * time it scrolls into view so listing pages stay light.
 */
export default function MapCanvas({
  points,
  center,
  zoom = 12,
  className,
  interactivePopups = false,
  resetLabel,
}: Props) {
  const holder = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const home = useRef<{ center: [number, number]; zoom: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = holder.current;
    if (!node || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || !holder.current) return;
    const first = points[0];
    const startCenter: [number, number] =
      center ?? (first ? [first.lng, first.lat] : [10.45, 51.16]);
    const startZoom = first?.precision === "approximate" ? Math.max(zoom - 2, 9) : zoom;
    const instance = new maplibregl.Map({
      container: holder.current,
      style: CARTO_LIGHT_STYLE as any,
      center: startCenter,
      // The wheel never zooms: on a trackpad that hijacks the page scroll.
      // Zooming is the +/- buttons, pinch on touch, and double click.
      scrollZoom: false,
      zoom: startZoom,
      attributionControl: { compact: true },
    });
    instance.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );

    for (const p of points) {
      const el = p.precision === "exact" ? exactMarkerEl() : areaMarkerEl();
      const marker = new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]);
      if (interactivePopups && p.title) {
        marker.setPopup(
          new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(popupHtml(p)),
        );
      }
      marker.addTo(instance);
    }

    if (points.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.lng, p.lat]));
      instance.fitBounds(bounds, { padding: 64, maxZoom: 13, duration: 0 });
    }

    map.current = instance;
    home.current = { center: startCenter, zoom: startZoom };
    return () => {
      instance.remove();
      map.current = null;
    };
  }, [visible, points, center, zoom, interactivePopups]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div ref={holder} className="h-full w-full" />
      {resetLabel ? (
        <button
          type="button"
          onClick={() => {
            const start = home.current;
            if (map.current && start) {
              map.current.easeTo({ center: start.center, zoom: start.zoom, duration: 500 });
            }
          }}
          className="absolute left-3 top-3 z-10 rounded-[var(--radius-button)] border border-border bg-background/95 px-3 py-2 text-xs text-foreground shadow-sm transition-colors hover:bg-secondary"
        >
          {resetLabel}
        </button>
      ) : null}
    </div>
  );
}
