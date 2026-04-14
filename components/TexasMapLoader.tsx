"use client";

import type { TexasFacility, TexasStartingPoint } from "@/types/texas-va";
import dynamic from "next/dynamic";

const TexasFacilitiesMap = dynamic(() => import("@/components/TexasFacilitiesMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-8 text-center text-sm text-stone-600">
      Loading map…
    </div>
  ),
});

export default function TexasMapLoader({
  facilities,
  startingPoint,
  defaultMapCenter,
  mapAriaLabel,
}: {
  facilities: TexasFacility[];
  startingPoint?: TexasStartingPoint;
  defaultMapCenter?: [number, number];
  mapAriaLabel: string;
}) {
  return (
    <TexasFacilitiesMap
      facilities={facilities}
      startingPoint={startingPoint}
      defaultMapCenter={defaultMapCenter}
      mapAriaLabel={mapAriaLabel}
    />
  );
}
