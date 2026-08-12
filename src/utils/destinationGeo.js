/**
 * Resolve Overpass search area from the active trip destination.
 * Known cities use curated centers; others fall back to Nominatim.
 */

export const CITY_GEO = {
  lisbon: {
    name: "Lisbon",
    country: "Portugal",
    lat: 38.7223,
    lng: -9.1393,
    radiusMeters: 3500,
  },
  rome: {
    name: "Rome",
    country: "Italy",
    lat: 41.9028,
    lng: 12.4964,
    radiusMeters: 2500,
  },
  roma: {
    name: "Rome",
    country: "Italy",
    lat: 41.9028,
    lng: 12.4964,
    radiusMeters: 2500,
  },
};

const normalizeKey = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export function getKnownCityGeo(trip) {
  if (!trip) return CITY_GEO.rome;

  const cityKey = normalizeKey(trip.city);
  const destKey = normalizeKey(trip.destination);

  if (CITY_GEO[cityKey]) return CITY_GEO[cityKey];

  for (const key of Object.keys(CITY_GEO)) {
    if (destKey.includes(key) || cityKey.includes(key)) {
      return CITY_GEO[key];
    }
  }

  return null;
}

/** Sync lookup for known cities; defaults to Rome center if unknown. */
export function getTripGeoSync(trip) {
  return (
    getKnownCityGeo(trip) || {
      name: trip?.city || trip?.destination?.split(",")[0] || "Rome",
      country: trip?.country || "",
      lat: 41.9028,
      lng: 12.4964,
      radiusMeters: 3000,
    }
  );
}

/**
 * Resolve geo for a trip. Uses curated data when possible,
 * otherwise Nominatim (OpenStreetMap) for the city name.
 */
export async function resolveTripGeo(trip) {
  const known = getKnownCityGeo(trip);
  if (known) return known;

  const query = [trip?.city, trip?.country || trip?.destination]
    .filter(Boolean)
    .join(", ");

  if (!query) return getTripGeoSync(null);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      { headers: { Accept: "application/json" } }
    );
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      return {
        name: trip.city || data[0].name || query,
        country: trip.country || "",
        lat: Number(data[0].lat),
        lng: Number(data[0].lon),
        radiusMeters: 3500,
      };
    }
  } catch (err) {
    console.warn("Nominatim lookup failed:", err);
  }

  return getTripGeoSync(trip);
}

/** Overpass filter fragment: `(around:radius,lat,lng)` */
export function overpassAround(geo) {
  const { lat, lng, radiusMeters = 3000 } = geo;
  return `(around:${radiusMeters},${lat},${lng})`;
}

export function destinationLabel(trip, geo) {
  return geo?.name || trip?.city || trip?.destination || "your destination";
}
