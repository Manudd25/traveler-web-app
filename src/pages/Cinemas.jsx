/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cinemas.css";
import { useFavorite } from "../contexts/FavoriteContext";


const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite(); 


  // Fallback cinemas for Rome
  const fallbackCinemas = [
    {
      id: "1",
      name: "Cinema Barberini",
      type: "Multiplex",
      description: "A modern cinema located near Piazza Barberini, showcasing the latest movies.",
      openingHours: "10:00 AM - 11:00 PM",
      image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2luZW1hJTIwYmFyYmVyaW5pfGVufDB8fDB8fHwy",
    },
    {
      id: "2",
      name: "Cinema Farnese",
      type: "Independent",
      description: "An indie cinema in Campo de' Fiori known for classic and arthouse films.",
      openingHours: "2:00 PM - 12:00 AM",
      image: "https://images.unsplash.com/photo-1619645404653-803b40048b87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2luZW1hcyUyMGluJTIwcm9tZXxlbnwwfHwwfHx8Mg%3D%3D",
    },
    {
      id: "3",
      name: "Cinema Adriano",
      type: "Multiplex",
      description: "Located in the Prati district, offering state-of-the-art movie experiences.",
      openingHours: "10:00 AM - 11:30 PM",
      image: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2luZW1hc3xlbnwwfHwwfHx8Mg%3D%3D",
    },
    
    {
      id: "4",
      name: "The Space Cinema Moderno",
      type: "Multiplex",
      description: "A popular cinema at Piazza della Repubblica with modern amenities.",
      openingHours: "10:00 AM - 12:00 AM",
      image: "https://images.pexels.com/photos/11961850/pexels-photo-11961850.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  useEffect(() => {
    const fetchCinemas = async () => {
      setLoading(true);

      try {
        // Overpass API query for cinemas in Rome
        const query = `
          [out:json];
          node["amenity"="cinema"](41.8902,12.4922,41.9029,12.5000);
          out body;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        // Fetch cinema images from Pixabay API
        const imageResponse = await fetch(
          `https://pixabay.com/api/?key=47226052-b8804eb501d7ae68ad2a6da9e&q=cinema&image_type=photo&per_page=15`
        );
        const imageData = await imageResponse.json();
        const images = imageData.hits.map((hit) => hit.webformatURL);

        // Format cinema data
        const apiCinemas = data.elements.slice(0, 15).map((cinema, index) => ({
          id: cinema.id,
          name: cinema.tags?.name || "Unnamed Cinema",
          type: "Cinema",
          description: cinema.tags?.description || "Enjoy the latest movies in a comfortable setting.",
          openingHours: cinema.tags?.opening_hours || "Opening hours unavailable.",
          image: images[index] || "https://via.placeholder.com/400x300?text=No+Image",
        }));

        // Filter out "Cineclub Detour"
        const filteredCinemas = apiCinemas.filter(
          (cinema) => cinema.name !== "Cineclub Detour"
        );

        // Combine filtered API data with fallback cinemas
        const combinedCinemas = [...filteredCinemas, ...fallbackCinemas];
        setCinemas(combinedCinemas);
      } catch (error) {
        console.error("Error fetching cinema data:", error);

        // Use fallback data in case of an error
        setCinemas(fallbackCinemas);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleViewDetails = (cinemaId) => {
    navigate(`/cinema-details/${cinemaId}`);
  };

  return (
    <div className="cinema-container">
      <h2>Cinemas in Rome</h2>
      {loading ? (
      <img src="/loading.gif" style={{width: "300px", background: "#eef6ff"}} alt="loading" />

      ) : cinemas.length === 0 ? (
        <p>No cinemas found in the specified area.</p>
      ) : (
        <div className="cinema-list">
          {cinemas.map((cinema) => (
            <div key={cinema.id} className="cinema-card">
              <div className="favorite-icon" onClick={() => toggleFavorite(cinema)}>
                    {favorites.some((fav) => fav.id === cinema.id) ? "❤️" : "🤍"}
                  </div>
              <img
                src={cinema.image}
                alt={cinema.name}
                className="cinema-image"
              />
              <div className="cinema-info">
                <h3>{cinema.name}</h3>
                <p>
                  <strong>Type:</strong> {cinema.type}
                </p>
                <p>{cinema.description}</p>
                <p>
                  <strong>Opening Hours:</strong> {cinema.openingHours}
                </p>
                <button
                  className="explore-btn"
                  onClick={() => handleViewDetails(cinema.id)}
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cinemas;
