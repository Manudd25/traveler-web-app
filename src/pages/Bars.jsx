import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Bars.css";
import { useFavorite } from "../contexts/FavoriteContext";

const Bars = () => {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();

  useEffect(() => {
    const fetchBars = async () => {
      setLoading(true);

      try {
        // Overpass API query for bars
        const query = `
          [out:json];
          node["amenity"="bar"](41.8902,12.4922,41.9029,12.5000);
          out body;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        // Fetch bar images from Pixabay API
        const imageResponse = await fetch(
          `https://pixabay.com/api/?key=47226052-b8804eb501d7ae68ad2a6da9e&q=bar&image_type=photo&per_page=15`
        );
        const imageData = await imageResponse.json();
        const images = imageData.hits.map((hit) => hit.webformatURL);

        // Format bar data with images
        const formattedData = data.elements.slice(0, 15).map((bar, index) => ({
          id: bar.id,
          name: bar.tags?.name || "Eternity Bar",
          description: bar.tags?.cuisine || "Enjoy a refreshing drink!",
          openingHours: bar.tags?.opening_hours || "12:00 - 23:00",
          image: images[index] || "https://via.placeholder.com/400x300?text=No+Image", // Fallback image
        }));

        setBars(formattedData);
      } catch (error) {
        console.error("Error fetching bar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  const handleVirtualTour = (barId) => {
    navigate(`/bar-virtual-tour/${barId}`);
  };

  return (
    <div className="bar-container">
      <h2>Discover Bars</h2>
      {loading ? (
        <img src="/loading.gif" style={{ width: "300px", background: "#eef6ff" }} alt="loading" />
      ) : bars.length === 0 ? (
        <p>No Bars found in the specified area.</p>
      ) : (
        <div className="bar-list">
          {bars.map((bar) => (
            <div key={bar.id} className="bar-card">
              <div className="favorite-icon" onClick={() => toggleFavorite(bar)}>
                {favorites.some((fav) => fav.id === bar.id) ? "❤️" : "🤍"}
              </div>
              <img src={bar.image} alt={bar.name} className="bar-image" />
              <div className="bar-info">
                <h3>{bar.name}</h3>
                <p>{bar.description}</p>
                <p>
                  <strong>Opening Hours:</strong> {bar.openingHours}
                </p>
                <button
                  className="book-table-btn"
                  onClick={() => handleVirtualTour(bar.id)}
                >
                  Have a look around!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bars;
