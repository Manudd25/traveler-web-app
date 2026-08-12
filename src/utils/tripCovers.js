import lisbonCover from "../assets/lisbon.jpg";
import romeCover from "../assets/rome.jpg";

export { lisbonCover, romeCover };

/** Local cover photos keyed by city slug. Add new assets here as you upload them. */
export const CITY_COVERS = {
  lisbon: lisbonCover,
  rome: romeCover,
  roma: romeCover,
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Find a bundled city photo from trip fields. */
export function matchCityCover({ city = "", destination = "" } = {}) {
  const haystack = normalize(`${city} ${destination}`);

  for (const [slug, image] of Object.entries(CITY_COVERS)) {
    if (haystack.includes(slug)) return image;
  }
  return null;
}

/**
 * Resolve the cover to display for a trip.
 * Priority: matched local city photo → stored coverImage → Lisbon default.
 */
export function resolveTripCover(trip) {
  return (
    matchCityCover(trip) ||
    trip?.coverImage ||
    lisbonCover
  );
}

/**
 * Attach the correct local cover when creating/updating a trip.
 * Keeps an explicit custom coverImage only when no local city match exists.
 */
export function withTripCover(tripData = {}) {
  const matched = matchCityCover(tripData);
  return {
    ...tripData,
    coverImage: matched || tripData.coverImage || "",
  };
}
