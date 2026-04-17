"use client";

import { EducationalFooter } from "@/components/EducationalFooter";
import { PageAccent } from "@/components/PageAccent";
import { SITE_NAME } from "@/lib/site";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";
import { useCallback, useEffect, useMemo, useState } from "react";
import TexasMapLoader from "@/components/TexasMapLoader";
import { haversineMiles } from "@/lib/geo";
import type { TexasFacility, TexasStartingPoint, TexasVaData } from "@/types/texas-va";

const MAP_HOME_KEY = "vet-to-vet-map-home-v1";

function fullStartingAddress(sp: TexasStartingPoint): string {
  return `${sp.addressLine}, ${sp.city}, ${sp.state} ${sp.zip}`;
}

function directionsHref(f: TexasFacility): string {
  const q = encodeURIComponent(`${f.address}, ${f.city}, ${f.state} ${f.zip}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

function directionsFromHome(sp: TexasStartingPoint, destAddress: string): string {
  const origin = encodeURIComponent(fullStartingAddress(sp));
  const dest = encodeURIComponent(destAddress);
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
}

function orgDirections(address: string, city: string, state: string, zip: string): string {
  const q = encodeURIComponent(`${address}, ${city}, ${state} ${zip}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

function facilityAddressLine(f: TexasFacility): string {
  return `${f.address}, ${f.city}, ${f.state} ${f.zip}`;
}

function zipToStartingPoint(
  payload: {
    zip: string;
    lat: number;
    lng: number;
    city: string;
    state: string;
  },
  stateCodeUpper: string,
): TexasStartingPoint {
  return {
    label: "Your ZIP",
    addressLine: `ZIP Code ${payload.zip}`,
    city: payload.city,
    state: stateCodeUpper,
    zip: payload.zip,
    lat: payload.lat,
    lng: payload.lng,
    privacyNote:
      "Approximate center of this ZIP from public postal data—not your street address. Use “Reset to default” to return to the built-in starting point.",
  };
}

export type TexasPageContentProps = {
  data: TexasVaData;
  /** USPS code, e.g. TX or CA */
  stateCode: string;
  stateName: string;
  accentClassName?: string;
  statePortal?: { name: string; url: string };
  footerVariant?: "compact";
};

export default function TexasPageContent({
  data,
  stateCode,
  stateName,
  accentClassName = "page-accent-texas",
  statePortal,
  footerVariant,
}: TexasPageContentProps) {
  const stateUpper = stateCode.trim().toUpperCase();
  const defaultHome = data.meta.startingPoint;
  const [userOrigin, setUserOrigin] = useState<TexasStartingPoint | null>(null);
  const [zipInput, setZipInput] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorError, setDoctorError] = useState<string | null>(null);

  const home = userOrigin ?? defaultHome;

  const sortedFacilities = useMemo(() => {
    if (!home) return data.facilities;
    return [...data.facilities].sort(
      (a, b) =>
        haversineMiles(home.lat, home.lng, a.lat, a.lng) -
        haversineMiles(home.lat, home.lng, b.lat, b.lng),
    );
  }, [data.facilities, home]);

  const defaultMapCenter = useMemo((): [number, number] => {
    const fs = data.facilities;
    if (fs.length === 0) return [31.5, -98.35];
    let la = 0;
    let lo = 0;
    for (const f of fs) {
      la += f.lat;
      lo += f.lng;
    }
    return [la / fs.length, lo / fs.length];
  }, [data.facilities]);

  const mapAriaLabel = `Map of ${stateName} VA facilities and starting point`;

  const applyZip = useCallback(async () => {
    setZipError(null);
    setAddressError(null);
    const digits = zipInput.replace(/\D/g, "").slice(0, 5);
    if (digits.length !== 5) {
      setZipError(`Enter a 5-digit ZIP code in ${stateName}.`);
      return;
    }
    setZipLoading(true);
    try {
      const res = await fetch("/api/geocode-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: digits, state: stateUpper }),
      });
      const payload = (await res.json()) as {
        error?: string;
        zip?: string;
        lat?: number;
        lng?: number;
        city?: string;
        state?: string;
      };
      if (!res.ok) {
        setZipError(payload.error ?? "Could not look up that ZIP.");
        return;
      }
      if (
        payload.zip === undefined ||
        payload.lat === undefined ||
        payload.lng === undefined ||
        payload.city === undefined
      ) {
        setZipError("Unexpected response from ZIP lookup.");
        return;
      }
      setUserOrigin(
        zipToStartingPoint(
          {
            zip: payload.zip,
            lat: payload.lat,
            lng: payload.lng,
            city: payload.city,
            state: payload.state ?? stateUpper,
          },
          stateUpper,
        ),
      );
      setZipInput(payload.zip);
    } catch {
      setZipError("Network error. Try again.");
    } finally {
      setZipLoading(false);
    }
  }, [zipInput, stateUpper, stateName]);

  const applyAddress = useCallback(async () => {
    setAddressError(null);
    const query = addressInput.trim();
    if (query.length < 6) {
      setAddressError("Enter a full street address.");
      return;
    }
    setAddressLoading(true);
    try {
      const res = await fetch("/api/geocode-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const payload = (await res.json()) as { error?: string; lat?: number; lng?: number; displayName?: string };
      if (!res.ok || payload.lat === undefined || payload.lng === undefined) {
        setAddressError(payload.error ?? "Could not find that address.");
        return;
      }
      setUserOrigin({
        label: "Your address",
        addressLine: payload.displayName ?? query,
        city: "",
        state: "",
        zip: "",
        lat: payload.lat,
        lng: payload.lng,
        privacyNote: "Address lookup is approximate. This is used only for map centering and directions links.",
      });
    } catch {
      setAddressError("Network error. Try again.");
    } finally {
      setAddressLoading(false);
    }
  }, [addressInput]);

  useEffect(() => {
    if (userOrigin !== null || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(MAP_HOME_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as TexasStartingPoint;
      if (
        saved &&
        typeof saved.addressLine === "string" &&
        typeof saved.lat === "number" &&
        typeof saved.lng === "number"
      ) {
        setUserOrigin(saved);
      }
    } catch {
      /* ignore */
    }
  }, [userOrigin]);

  const resetOrigin = useCallback(() => {
    setUserOrigin(null);
    setZipError(null);
    setAddressError(null);
    setZipInput("");
  }, []);

  return (
    <ServiceSubpageFrame>
      <PageAccent className={accentClassName} />
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 py-12 pb-24">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{data.meta.title}</h1>
        <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600">{data.meta.disclaimer}</p>
        <p className="text-xs text-stone-500">Last reviewed for this build: {data.meta.lastReviewed}</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium text-stone-800">Scheduling &amp; main lines</h2>
        <ul className="flex flex-col gap-3">
          {data.scheduling.map((row) => (
            <li
              key={row.label}
              className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
            >
              <p className="font-medium text-stone-800">{row.label}</p>
              <p className="mt-1 font-mono text-stone-900">{row.phone}</p>
              <p className="mt-2 text-xs leading-relaxed text-stone-500">{row.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {statePortal ? (
        <section className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/80 px-5 py-5">
          <h2 className="text-sm font-semibold text-stone-900">State veterans office</h2>
          <p className="text-sm leading-relaxed text-stone-600">
            Programs run by {stateName} (not federal VA) may include education, employment, and tax relief—verify on the
            state&apos;s official site.
          </p>
          <a
            href={statePortal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-800 underline decoration-blue-300 underline-offset-2"
          >
            {statePortal.name} — official website
          </a>
        </section>
      ) : null}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-stone-800">Map — where you&apos;re headed</h2>
        <p className="text-sm leading-relaxed text-stone-600">
          Enter your <strong className="font-medium text-stone-700">{stateName} ZIP code</strong> to center the map and
          sort facilities by distance from that ZIP (approximate postal center). You can also enter a full street
          address.
        </p>
        <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white px-4 py-4">
          <label htmlFor="state-va-zip" className="text-sm font-medium text-stone-800">
            Your {stateName} ZIP
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <input
              id="state-va-zip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={10}
              placeholder="e.g. 77355"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void applyZip();
              }}
              className="min-w-[140px] flex-1 rounded-md border border-stone-300 px-3 py-2 font-mono text-sm text-stone-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="button"
              onClick={() => void applyZip()}
              disabled={zipLoading}
              className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-900 disabled:opacity-60"
            >
              {zipLoading ? "Updating…" : "Update map"}
            </button>
            {userOrigin && defaultHome ? (
              <button
                type="button"
                onClick={resetOrigin}
                className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-50"
              >
                Reset default
              </button>
            ) : null}
          </div>
          {zipError ? <p className="text-sm text-red-700">{zipError}</p> : null}

          <label htmlFor="state-va-address" className="mt-2 text-sm font-medium text-stone-800">
            Home address (full street)
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <input
              id="state-va-address"
              type="text"
              autoComplete="street-address"
              placeholder="123 Main St, Magnolia, TX 77355"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void applyAddress();
              }}
              className="min-w-[220px] flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="button"
              onClick={() => void applyAddress()}
              disabled={addressLoading}
              className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-900 disabled:opacity-60"
            >
              {addressLoading ? "Centering…" : "Center map to address"}
            </button>
          </div>
          {addressError ? <p className="text-sm text-red-700">{addressError}</p> : null}
        </div>
        <p className="text-sm leading-relaxed text-stone-600">
          Blue pins are VA locations on this list; the green dot is your starting point (ZIP center or default). Popups
          include Google Maps links—use <strong className="font-medium text-stone-700">From home</strong> for routing from
          that point.
        </p>
        <TexasMapLoader
          facilities={sortedFacilities}
          startingPoint={home}
          defaultMapCenter={defaultMapCenter}
          mapAriaLabel={mapAriaLabel}
        />
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white px-4 py-4">
        <h2 className="text-sm font-semibold text-stone-900">Out-of-network doctor address search</h2>
        <p className="text-sm leading-relaxed text-stone-600">
          Going to a community provider? Enter the address and open directions quickly.
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <input
            type="text"
            autoComplete="street-address"
            placeholder="Doctor or clinic address"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
            className="min-w-[220px] flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="button"
            onClick={() => {
              setDoctorError(null);
              const dest = doctorAddress.trim();
              if (dest.length < 6) {
                setDoctorError("Enter a full doctor/clinic address.");
                return;
              }
              if (home) {
                window.open(directionsFromHome(home, dest), "_blank", "noopener,noreferrer");
                return;
              }
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-stone-900"
          >
            Open directions
          </button>
        </div>
        {doctorError ? <p className="text-sm text-red-700">{doctorError}</p> : null}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-stone-800">
          VA medical centers &amp; clinics
          {home ? " (nearest first)" : ""}
        </h2>
        {home ? (
          <p className="text-sm text-stone-600">
            ~Miles shown are straight-line (crow flies). Driving miles and time are usually higher—use the maps links for
            real routes.
          </p>
        ) : null}
        <ul className="flex flex-col gap-6">
          {sortedFacilities.map((f) => {
            const mi = home ? haversineMiles(home.lat, home.lng, f.lat, f.lng) : null;
            return (
              <li key={f.id} className="rounded-lg border border-stone-200 bg-stone-50/90 px-4 py-4">
                {mi !== null ? (
                  <p className="text-xs font-medium text-emerald-800">
                    ~{mi.toFixed(0)} mi from {userOrigin ? `ZIP ${userOrigin.zip}` : "home"} (straight line)
                  </p>
                ) : null}
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                  {f.kind} · {f.system}
                </p>
                <p className="mt-1 font-medium text-stone-900">{f.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {f.address}
                  <br />
                  {f.city}, {f.state} {f.zip}
                </p>
                <p className="mt-3 text-sm text-stone-800">
                  <span className="text-stone-500">Main phone:</span>{" "}
                  <span className="font-mono">{f.phoneMain}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  <span className="font-medium text-stone-700">Hours / timing:</span> {f.hoursSummary}
                </p>
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <a
                    className="text-blue-800 underline decoration-blue-300 underline-offset-2"
                    href={directionsHref(f)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Directions (destination only)
                  </a>
                  {home ? (
                    <a
                      className="text-blue-800 underline decoration-blue-300 underline-offset-2"
                      href={directionsFromHome(home, facilityAddressLine(f))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      From home
                    </a>
                  ) : null}
                  <a
                    className="text-blue-800 underline decoration-blue-300 underline-offset-2"
                    href={f.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    VA.gov facility page
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {data.organizations.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-stone-800">VSO / VFW / state veteran contacts (sample)</h2>
          <p className="text-sm leading-relaxed text-stone-600">
            These are not VA facilities. Hours vary widely—call before you drive. Listing an organization here does not
            imply endorsement, partnership, or a recommendation for claims or benefits help—contact each organization
            directly about what it offers.
          </p>
          <ul className="flex flex-col gap-6">
            {data.organizations.map((o) => (
              <li key={o.id} className="rounded-lg border border-stone-200 bg-white px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{o.kind}</p>
                <p className="mt-1 font-medium text-stone-900">{o.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {o.address}
                  <br />
                  {o.city}, {o.state} {o.zip}
                </p>
                <p className="mt-3 text-sm">
                  <span className="text-stone-500">Phone:</span>{" "}
                  <span className="font-mono text-stone-900">{o.phone}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  <span className="font-medium text-stone-700">Hours:</span> {o.hoursNote}
                </p>
                <p className="mt-2 text-xs text-stone-500">{o.sourceNote}</p>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  <a
                    className="text-sm text-blue-800 underline decoration-blue-300 underline-offset-2"
                    href={orgDirections(o.address, o.city, o.state, o.zip)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Directions (destination only)
                  </a>
                  {home ? (
                    <a
                      className="text-sm text-blue-800 underline decoration-blue-300 underline-offset-2"
                      href={directionsFromHome(home, `${o.address}, ${o.city}, ${o.state} ${o.zip}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      From home
                    </a>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-5">
        <h2 className="text-sm font-medium text-stone-800">Official sources (bookmark these)</h2>
        <ul className="list-inside list-disc space-y-3 text-sm text-stone-700">
          {data.meta.sources.map((s, idx) => (
            <li key={`${s.url}-${idx}`}>
              <p className="text-stone-600">{s.label}</p>
              <a className="text-blue-800 underline" href={s.url} target="_blank" rel="noopener noreferrer">
                Source page
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-amber-200/80 bg-amber-50/60 px-4 py-5">
        <h2 className="text-lg font-medium text-stone-800">{data.emergencyCopy.title}</h2>
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-stone-700">
          {data.emergencyCopy.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="whitespace-pre-line text-xs leading-relaxed text-stone-500">
          {data.emergencyCopy.disclaimer}
        </p>
      </section>

      <p className="text-xs leading-relaxed text-stone-500">
        <span className="font-medium text-stone-600">Educational use only.</span> {SITE_NAME} does not
        give legal or medical advice, does not represent anyone before VA, and does not guarantee
        that distances, hours, or phone numbers are accurate. Maps and directions use third-party
        services for convenience—verify details with official sources.
      </p>

      {footerVariant === "compact" ? <EducationalFooter variant="compact" /> : null}
      </div>
    </ServiceSubpageFrame>
  );
}
