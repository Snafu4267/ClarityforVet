import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/rate-limit";

/** Approximate ZIP center via Zippopotam (no API key). Optional `state` = expected USPS code (e.g. TX, CA); defaults to TX for older clients. */
export async function POST(req: Request) {
  const limited = rateLimitResponse(req, { key: "geocode-zip", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = typeof body === "object" && body !== null && "zip" in body ? String((body as { zip: unknown }).zip) : "";
  const stateRaw =
    typeof body === "object" && body !== null && "state" in body ? String((body as { state: unknown }).state) : "";
  const expectedState = (stateRaw.trim() === "" ? "TX" : stateRaw.trim()).toUpperCase();
  if (!/^[A-Z]{2}$/.test(expectedState)) {
    return NextResponse.json({ error: "Invalid state code." }, { status: 400 });
  }

  const digits = raw.replace(/\D/g, "").slice(0, 5);

  if (digits.length !== 5) {
    return NextResponse.json({ error: "Enter a valid 5-digit ZIP code." }, { status: 400 });
  }

  const res = await fetch(`https://api.zippopotam.us/us/${digits}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "ZIP code not found." }, { status: 404 });
  }

  const data = (await res.json()) as {
    places?: Array<{
      "place name"?: string;
      latitude?: string;
      longitude?: string;
      "state abbreviation"?: string;
    }>;
  };

  const place = data.places?.[0];
  if (!place?.latitude || !place.longitude) {
    return NextResponse.json({ error: "No location data for this ZIP." }, { status: 404 });
  }

  const zipState = (place["state abbreviation"] ?? "").toUpperCase();
  if (zipState !== expectedState) {
    const where =
      zipState === "" ? "another state" : zipState === "PR" || zipState === "GU" || zipState === "VI"
        ? `a U.S. territory (${zipState})`
        : zipState;
    return NextResponse.json(
      {
        error: `That ZIP is not in ${expectedState} (it resolves to ${where}). Use the ZIP field on the page for that state.`,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    zip: digits,
    lat: parseFloat(place.latitude),
    lng: parseFloat(place.longitude),
    city: place["place name"] ?? "",
    state: expectedState,
  });
}
