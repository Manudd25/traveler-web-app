import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../contexts/FavoriteContext";
import { useTripDestination } from "../hooks/useTripDestination";
import { restaurantFallbacks } from "../data/restaurantFallbacks";
import { fetchCityImages } from "../utils/fetchCityImages";
import { fetchOverpass } from "../utils/fetchOverpass";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const { cityName, around, tripKey, ready } = useTripDestination();

  useEffect(() => {
    if (!ready) return;

    const fetchRestaurants = async () => {
      setLoading(true);
      const fallbacks = restaurantFallbacks(cityName);

      try {
        const query = `
          [out:json][timeout:25];
          (
            node["amenity"="restaurant"]${around};
            way["amenity"="restaurant"]${around};
          );
          out center 40;
        `;

        const [data, images] = await Promise.all([
          fetchOverpass(query),
          fetchCityImages(`${cityName} restaurant`, { perPage: 15 }),
        ]);

        const apiRestaurants = (data?.elements || [])
          .filter((item) => item?.tags?.name)
          .slice(0, 15)
          .map((restaurant, index) => ({
            id: restaurant.id,
            name: restaurant.tags.name,
            description: restaurant.tags?.cuisine || "Cuisine details unavailable.",
            openingHours: restaurant.tags?.opening_hours || "12:00 - 23:00",
            image: images[index] || fallbacks[index % fallbacks.length].image,
            city: cityName,
          }));

        setRestaurants(apiRestaurants.length ? apiRestaurants : fallbacks);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setRestaurants(fallbacks);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [ready, tripKey, around, cityName]);

  const handleBookTable = (restaurantId) => {
    navigate(`/table-booking/${restaurantId}`);
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Restaurants</h1>
          <p>Near {cityName} · based on your active trip</p>
        </div>
      </div>

      {loading ? (
        <div className="trv-loading"><img src="/loading.gif" alt="Loading" /></div>
      ) : restaurants.length === 0 ? (
        <div className="trv-empty">
          <h3>No results</h3>
          <p>No restaurants found near {cityName}.</p>
        </div>
      ) : (
        <div className="trv-venue-grid">
          {restaurants.map((restaurant) => (
            <article key={restaurant.id} className="trv-venue-card">
              <button type="button" className="trv-fav" onClick={() => toggleFavorite(restaurant)} aria-label="Toggle favorite">
                {favorites.some((fav) => fav.id === restaurant.id) ? "❤️" : "🤍"}
              </button>
              <img src={restaurant.image} alt={restaurant.name} className="trv-venue-image" loading="lazy" decoding="async" />
              <div className="trv-venue-body">
                <h3>{restaurant.name}</h3>
                <p className="trv-venue-meta">{restaurant.description}</p>
                <p className="trv-venue-meta">
                  <strong>Opening Hours:</strong> {restaurant.openingHours}
                </p>
                <button
                  type="button"
                  className="trv-btn trv-btn-primary"
                  onClick={() => handleBookTable(restaurant.id)}
                >
                  Book a Table
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
