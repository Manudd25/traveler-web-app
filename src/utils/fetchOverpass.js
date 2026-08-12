const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

/**
 * Run an Overpass QL query against public mirrors until one succeeds.
 * Returns parsed JSON or null.
 */
export async function fetchOverpass(query, { timeoutMs = 25000 } = {}) {
  const body = `data=${encodeURIComponent(query)}`;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        body,
        signal: controller.signal,
      });

      if (!response.ok) continue;

      const data = await response.json();
      if (data && Array.isArray(data.elements)) return data;
    } catch {
      /* try next mirror */
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}
