import { NextResponse } from "next/server";

type NominatimRow = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query =
    typeof body === "object" && body !== null && "query" in body ? String((body as { query: unknown }).query).trim() : "";

  if (query.length < 6) {
    return NextResponse.json({ error: "Enter a full address to search." }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Clarity4Vets/1.0 (address lookup for VA map centering)",
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Address lookup failed." }, { status: 502 });
  }

  const rows = (await res.json()) as NominatimRow[];
  const first = rows?.[0];
  if (!first?.lat || !first.lon) {
    return NextResponse.json({ error: "Address not found. Try a more complete address." }, { status: 404 });
  }

  return NextResponse.json({
    lat: Number.parseFloat(first.lat),
    lng: Number.parseFloat(first.lon),
    displayName: first.display_name ?? query,
  });
}
