import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../contexts/FavoriteContext";
import { useTripDestination } from "../hooks/useTripDestination";
import { barFallbacks } from "../data/barFallbacks";
import { fetchCityImages } from "../utils/fetchCityImages";
import { fetchOverpass } from "../utils/fetchOverpass";

const Bars = () => {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const { cityName, around, tripKey, ready } = useTripDestination();

  useEffect(() => {
    if (!ready) return;

    const fetchBars = async () => {
      setLoading(true);
      const fallbacks = barFallbacks(cityName);

      try {
        const query = `
          [out:json][timeout:25];
          (
            node["amenity"="bar"]${around};
            node["amenity"="pub"]${around};
            way["amenity"="bar"]${around};
            way["amenity"="pub"]${around};
          );
          out center 40;
        `;

        const [data, images] = await Promise.all([
          fetchOverpass(query),
          fetchCityImages(`${cityName} bar`, { perPage: 15 }),
        ]);

        const apiBars = (data?.elements || [])
          .filter((item) => item?.tags?.name)
          .slice(0, 15)
          .map((bar, index) => ({
            id: bar.id,
            name: bar.tags.name,
            description: bar.tags?.cuisine || bar.tags?.amenity || "Enjoy a refreshing drink!",
            openingHours: bar.tags?.opening_hours || "12:00 - 23:00",
            image: images[index] || fallbacks[index % fallbacks.length].image,
            city: cityName,
          }));

        setBars(apiBars.length ? apiBars : fallbacks);
      } catch (error) {
        console.error("Error fetching bar data:", error);
        setBars(fallbacks);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, [ready, tripKey, around, cityName]);

  const handleVirtualTour = (barId) => {
    navigate(`/bar-virtual-tour/${barId}`);
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Bars & Pubs</h1>
          <p>Near {cityName} · based on your active trip</p>
        </div>
      </div>

      {loading ? (
        <div className="trv-loading"><img src="/loading.gif" alt="Loading" /></div>
      ) : bars.length === 0 ? (
        <div className="trv-empty">
          <h3>No results</h3>
          <p>No bars found near {cityName}.</p>
        </div>
      ) : (
        <div className="trv-venue-grid">
          {bars.map((bar) => (
            <article key={bar.id} className="trv-venue-card">
              <button type="button" className="trv-fav" onClick={() => toggleFavorite(bar)} aria-label="Toggle favorite">
                {favorites.some((fav) => fav.id === bar.id) ? "❤️" : "🤍"}
              </button>
              <img src={bar.image} alt={bar.name} className="trv-venue-image" loading="lazy" decoding="async" />
              <div className="trv-venue-body">
                <h3>{bar.name}</h3>
                <p className="trv-venue-meta">{bar.description}</p>
                <p className="trv-venue-meta">
                  <strong>Opening Hours:</strong> {bar.openingHours}
                </p>
                <button type="button" className="trv-btn trv-btn-primary" onClick={() => handleVirtualTour(bar.id)}>
                  Virtual Tour
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bars;
