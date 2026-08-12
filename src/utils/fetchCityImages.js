const PIXABAY_KEY = "47226052-b8804eb501d7ae68ad2a6da9e";

/**
 * Fetch city / place photos from Pixabay for discovery & booking galleries.
 * Returns an empty array on failure so callers can keep static fallbacks.
 */
export async function fetchCityImages(query, { perPage = 12 } = {}) {
  const q = String(query || "").trim();
  if (!q) return [];

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
        q
      )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.hits || [])
      .map((hit) => hit.webformatURL || hit.largeImageURL)
      .filter(Boolean);
  } catch {
    return [];
  }
}
