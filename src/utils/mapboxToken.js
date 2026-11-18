/** Public Mapbox token from env — never hardcode tokens in source. */
export const MAPBOX_TOKEN = String(import.meta.env.MAPBOX_TOKEN || "").trim();

export const hasMapboxToken = Boolean(MAPBOX_TOKEN);
