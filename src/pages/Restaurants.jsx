import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Restaurants.css";
import { useFavorite } from "../contexts/FavoriteContext";


const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite(); 


  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);

      try {
        // Overpass API query for restaurants in Rome
        const query = `
          [out:json];
          node["amenity"="restaurant"](41.8902,12.4922,41.9029,12.5000);
          out body;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        // Fetch 15 unique restaurant images from Pixabay API
        const imageResponse = await fetch(
          `https://pixabay.com/api/?key=47226052-b8804eb501d7ae68ad2a6da9e&q=restaurant&image_type=photo&per_page=15`
        );
        const imageData = await imageResponse.json();
        const images = imageData.hits.map((hit) => hit.webformatURL);

        // Format restaurant data with images
        const formattedData = data.elements.slice(0, 15).map((restaurant, index) => ({
          id: restaurant.id,
          name: restaurant.tags?.name || "Unnamed Restaurant",
          description:
            restaurant.tags?.cuisine || "Cuisine details unavailable.",
          openingHours: restaurant.tags?.opening_hours || "12:00 - 23:00",
          image: images[index] || "https://via.placeholder.com/400x300?text=No+Image", // Fallback image
        }));

        setRestaurants(formattedData);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleBookTable = (restaurantId) => {
    navigate(`/table-booking/${restaurantId}`);
  };

  return (
    <div className="restaurant-container">
      <h2>Discover Restaurants</h2>
      {loading ? (
      <img src="/loading.gif" style={{width: "300px", background: "#eef6ff"}} alt="loading" />

      ) : restaurants.length === 0 ? (
        <p>No restaurants found in the specified area.</p>
      ) : (
        <div className="restaurant-list">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <div className="favorite-icon" onClick={() => toggleFavorite(restaurant)}>
                    {favorites.some((fav) => fav.id === restaurant.id) ? "❤️" : "🤍"}
                  </div>
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
                <p>
                  <strong>Opening Hours:</strong> {restaurant.openingHours}
                </p>
                <button
                  className="book-table-btn"
                  onClick={() => handleBookTable(restaurant.id)}
                >
                  Book a Table
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
