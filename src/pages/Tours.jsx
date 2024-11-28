/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tours.css";
import { useFavorite } from "../contexts/FavoriteContext";


const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite(); 

  

  const fallbackTours = [
    {
      id: "1",
      name: "Colosseum Guided Tour",
      type: "Historical",
      description: "Experience the grandeur of the Colosseum with a professional guide.",
      duration: "2 hours",
      image: "https://images.unsplash.com/photo-1699012462295-bace478f27bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbG9zc2V1bSUyMHRvdXJ8ZW58MHx8MHx8fDI%3D",
    },
    {
      id: "2",
      name: "Vatican Museums and Sistine Chapel",
      type: "Cultural",
      description: "Explore the Vatican Museums and marvel at Michelangelo's masterpiece.",
      duration: "3 hours",
      image: "https://images.unsplash.com/photo-1593548615306-d1db319843b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHZhdGljYW4lMjBtdXNldW1zfGVufDB8fDB8fHwy",
    },
    {
      id: "3",
      name: "Walking Tour of Trastevere",
      type: "Walking Tour",
      description: "Discover the charm of Trastevere with its cobblestone streets and history.",
      duration: "1.5 hours",
      image: "https://media.istockphoto.com/id/508540910/de/foto/rom-sonnenuntergang-%C3%BCber-tiber-und-st-peter-basilika-im-vatikan-italien.jpg?s=612x612&w=0&k=20&c=ZL7cqs0jtC04m_Lhh7P-phq8mUEcnSyhNcCUV-KcbYE=",
    },
    {
      id: "4",
      name: "Ancient Rome Highlights",
      type: "Historical",
      description: "Visit the Roman Forum, Palatine Hill, and other ancient landmarks.",
      duration: "2.5 hours",
      image: "https://images.pexels.com/photos/2031968/pexels-photo-2031968.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "5",
      name: "Food and Wine Tour in Rome",
      type: "Culinary",
      description: "Taste traditional Roman dishes and wines in authentic locations.",
      duration: "3 hours",
      image: "https://images.pexels.com/photos/9387331/pexels-photo-9387331.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        id: "6",
        name: "Illuminati Tour: The Path of Illumination",
        type: "Cultural",
        description:
          "Follow the path of the Illuminati, visiting Rome's iconic seven churches featured in the film Angels & Demons.",
        duration: "4 hours",
        image: "https://images.pexels.com/photos/20271091/pexels-photo-20271091/free-photo-of-piazza-del-popolo-in-rome.jpeg?auto=compress&cs=tinysrgb&w=600",
      }
  ];

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);

      try {
        // Overpass API query for guided tours in Rome
        const query = `
          [out:json];
          (
            node["tourism"="information"]["information"="guide"](41.8902,12.4922,41.9029,12.5000);
            node["tourism"="attraction"]["operator"](41.8902,12.4922,41.9029,12.5000);
          );
          out body;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        // Fetch tour images from Pixabay API
        const imageResponse = await fetch(
          `https://pixabay.com/api/?key=47226052-b8804eb501d7ae68ad2a6da9e&q=Rome+Guided+Tours&image_type=photo&per_page=15`
        );
        const imageData = await imageResponse.json();
        const images = imageData.hits.map((hit) => hit.webformatURL);

        // Format tour data
        let formattedData = data.elements.slice(0, 15).map((tour, index) => ({
          id: tour.id,
          name: tour.tags?.name || `Guided Tour at ${tour.tags?.operator || "Unknown Operator"}`,
          type: tour.tags?.tourism || "Tour",
          description: tour.tags?.description || "Explore Rome with a professional guide.",
          duration: tour.tags?.duration || "Flexible Timing",
          image: images[index] || "https://via.placeholder.com/400x300?text=No+Image",
        }));

        // If no tours are fetched, use fallback data
        if (formattedData.length === 0) {
          formattedData = fallbackTours;
        }

        setTours(formattedData);
      } catch (error) {
        console.error("Error fetching tour data:", error);

        // Use fallback data in case of an error
        setTours(fallbackTours);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleViewDetails = (tourId) => {
    navigate(`/tour-details/${tourId}`);
  };

  return (
    <div className="tour-container">
      <h2>Guided Tours in Rome</h2>
      {loading ? (
      <img src="/loading.gif" style={{width: "300px", background: "#eef6ff"}} alt="loading" />

      ) : tours.length === 0 ? (
        <p>No tours found in the specified area.</p>
      ) : (
        <div className="tour-list">
          {tours.map((tour) => (
            <div key={tour.id} className="tour-card">
              <div className="favorite-icon" onClick={() => toggleFavorite(tour)}>
                    {favorites.some((fav) => fav.id === tour.id) ? "❤️" : "🤍"}
                  </div>
              <img
                src={tour.image}
                alt={tour.name}
                className="tour-image"
              />
              <div className="tour-info">
                <h3>{tour.name}</h3>
                <p>
                  <strong>Type:</strong> {tour.type}
                </p>
                <p>{tour.description}</p>
                <p>
                  <strong>Duration:</strong> {tour.duration}
                </p>
                <button
                  className="explore-btn"
                  onClick={() => handleViewDetails(tour.id)}
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

export default Tours;
