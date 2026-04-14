"use client";

import type { TexasFacility, TexasStartingPoint } from "@/types/texas-va";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }
    const b = L.latLngBounds(points);
    map.fitBounds(b, { padding: [48, 48], maxZoom: 9 });
  }, [map, points]);

  return null;
}

function useFixLeafletIcons() {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);
}

function fullStartingAddress(h: TexasStartingPoint): string {
  return `${h.addressLine}, ${h.city}, ${h.state} ${h.zip}`;
}

function directionsHref(f: TexasFacility): string {
  const q = encodeURIComponent(`${f.address}, ${f.city}, ${f.state} ${f.zip}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

function directionsFromHome(home: TexasStartingPoint, f: TexasFacility): string {
  const origin = encodeURIComponent(fullStartingAddress(home));
  const dest = encodeURIComponent(`${f.address}, ${f.city}, ${f.state} ${f.zip}`);
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
}

export default function TexasFacilitiesMap({
  facilities,
  startingPoint,
  defaultMapCenter,
  mapAriaLabel,
}: {
  facilities: TexasFacility[];
  startingPoint?: TexasStartingPoint;
  /** Used when `startingPoint` is missing (before fit-bounds). Defaults to Texas-ish center. */
  defaultMapCenter?: [number, number];
  mapAriaLabel: string;
}) {
  useFixLeafletIcons();

  const points = useMemo(() => {
    const pts = facilities.map((f) => [f.lat, f.lng] as [number, number]);
    if (startingPoint) {
      pts.push([startingPoint.lat, startingPoint.lng]);
    }
    return pts;
  }, [facilities, startingPoint]);

  const fallbackCenter = defaultMapCenter ?? ([31.5, -98.35] as [number, number]);

  const center: [number, number] = startingPoint
    ? [startingPoint.lat, startingPoint.lng]
    : fallbackCenter;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-sm">
      <p className="border-b border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
        Map: VA facilities (blue pins) and your starting point (green dot—ZIP center or default). Tap a pin for links.
      </p>
      <div className="relative h-[min(420px,70vh)] w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:z-0">
        <MapContainer
          center={center}
          zoom={startingPoint ? 8 : 6}
          className="h-full w-full"
          scrollWheelZoom
          aria-label={mapAriaLabel}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds points={points} />
          {startingPoint ? (
            <CircleMarker
              center={[startingPoint.lat, startingPoint.lng]}
              radius={12}
              pathOptions={{
                color: "#15803d",
                fillColor: "#22c55e",
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 text-sm text-stone-800">
                  <p className="font-semibold">{startingPoint.label}</p>
                  <p className="mt-1 text-xs leading-snug text-stone-600">
                    {fullStartingAddress(startingPoint)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ) : null}
          {facilities.map((f) => (
            <Marker key={f.id} position={[f.lat, f.lng]}>
              <Popup>
                <div className="min-w-[200px] p-1 text-stone-800">
                  <p className="font-semibold">{f.name}</p>
                  <p className="mt-1 text-xs text-stone-600">
                    {f.kind} · {f.system}
                  </p>
                  <p className="mt-2 text-xs leading-snug">
                    {f.address}
                    <br />
                    {f.city}, {f.state} {f.zip}
                  </p>
                  <p className="mt-2 flex flex-col gap-1 text-xs">
                    <a className="text-blue-700 underline" href={directionsHref(f)}>
                      Directions (destination only)
                    </a>
                    {startingPoint ? (
                      <a className="text-blue-700 underline" href={directionsFromHome(startingPoint, f)}>
                        From home
                      </a>
                    ) : null}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
