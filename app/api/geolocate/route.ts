import { NextResponse } from "next/server";

type ReverseLookupResponse = { address?: { country_code?: string } };
type RateLimitState = typeof globalThis & { nominatimNextRequestAt?: number };

async function waitForNominatimSlot() {
  const state = globalThis as RateLimitState;
  const now = Date.now();
  const allowedAt = Math.max(now, state.nominatimNextRequestAt ?? now);
  if (allowedAt - now > 10000) return false;
  state.nominatimNextRequestAt = allowedAt + 1100;
  if (allowedAt > now) await new Promise((resolve) => setTimeout(resolve, allowedAt - now));
  return true;
}

export async function POST(request: Request) {
  let body: { latitude?: unknown; longitude?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid location data." }, { status: 400 });
  }

  const latitude = body.latitude;
  const longitude = body.longitude;
  if (typeof latitude !== "number" || typeof longitude !== "number" ||
      !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "Invalid coordinates." }, { status: 400 });
  }

  const endpoint = process.env.GEOCODING_URL ?? "https://nominatim.openstreetmap.org/reverse";
  const url = new URL(endpoint);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", "3");
  url.searchParams.set("addressdetails", "1");

  try {
    if (!await waitForNominatimSlot()) {
      return NextResponse.json({ error: "Location lookup is busy. Please try again." }, { status: 429 });
    }
    const response = await fetch(url, {
      headers: { "User-Agent": "NabtaEdu/1.0 (language detection)", "Accept-Language": "en" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Reverse geocoding failed");

    const result = await response.json() as ReverseLookupResponse;
    const countryCode = result.address?.country_code?.toLowerCase();
    if (!countryCode || !/^[a-z]{2}$/.test(countryCode)) {
      return NextResponse.json({ error: "Country could not be determined." }, { status: 404 });
    }

    return NextResponse.json({ countryCode });
  } catch {
    return NextResponse.json({ error: "Location lookup is unavailable." }, { status: 503 });
  }
}
