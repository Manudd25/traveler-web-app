/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../contexts/FavoriteContext";
import { useTripDestination } from "../hooks/useTripDestination";

const romeFallbacks = [
  {
    id: "rome-1",
    name: "Cinema Barberini",
    type: "Multiplex",
    description: "A modern cinema near Piazza Barberini.",
    openingHours: "10:00 AM - 11:00 PM",
    image:
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "rome-2",
    name: "Cinema Farnese",
    type: "Independent",
    description: "Indie cinema in Campo de' Fiori for classic and arthouse films.",
    openingHours: "2:00 PM - 12:00 AM",
    image:
      "https://images.unsplash.com/photo-1619645404653-803b40048b87?w=500&auto=format&fit=crop&q=60",
  },
];

const lisbonFallbacks = [
  {
    id: "lisbon-1",
    name: "Cinema São Jorge",
    type: "Historic",
    description: "Iconic cinema on Avenida da Liberdade with classic screenings.",
    openingHours: "2:00 PM - 11:00 PM",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "lisbon-2",
    name: "Cinema Ideal",
    type: "Independent",
    description: "Independent cinema in Chiado known for arthouse films.",
    openingHours: "3:00 PM - 11:30 PM",
    image:
      "https://images.unsplash.com/photo-1517604931442-73e9d2d5f0c4?w=500&auto=format&fit=crop&q=60",
  },
];

const Cinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const { cityName, around, tripKey, ready, geo } = useTripDestination();

  useEffect(() => {
    if (!ready) return;

    const fetchCinemas = async () => {
      setLoading(true);
      const cityKey = cityName.toLowerCase();
      const fallbacks = cityKey.includes("lisbon")
        ? lisbonFallbacks
        : cityKey.includes("rome")
          ? romeFallbacks
          : [];

      try {
        const query = `
          [out:json];
          (
            node["amenity"="cinema"]${around};
            way["amenity"="cinema"]${around};
          );
          out center;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        const imageResponse = await fetch(
          `https://pixabay.com/api/?key=47226052-b8804eb501d7ae68ad2a6da9e&q=${encodeURIComponent(
            `${cityName} cinema`
          )}&image_type=photo&per_page=15`
        );
        const imageData = await imageResponse.json();
        const images = (imageData.hits || []).map((hit) => hit.webformatURL);

        const apiCinemas = (data.elements || []).slice(0, 15).map((cinema, index) => ({
          id: cinema.id,
          name: cinema.tags?.name || "Unnamed Cinema",
          type: "Cinema",
          description:
            cinema.tags?.description ||
            `Enjoy the latest movies in ${cityName}.`,
          openingHours: cinema.tags?.opening_hours || "Opening hours unavailable.",
          image: images[index] || "https://via.placeholder.com/400x300?text=No+Image",
          city: cityName,
        }));

        const filtered = apiCinemas.filter((c) => c.name !== "Cineclub Detour");
        setCinemas(filtered.length ? filtered : fallbacks);
      } catch (error) {
        console.error("Error fetching cinema data:", error);
        setCinemas(fallbacks);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, [ready, tripKey, around, cityName]);

  const handleViewDetails = (cinemaId) => {
    navigate(`/cinema-details/${cinemaId}`, {
      state: { cityName, geo },
    });
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Cinemas</h1>
          <p>Near {cityName} · based on your active trip</p>
        </div>
      </div>

      {loading ? (
        <div className="trv-loading"><img src="/loading.gif" alt="Loading" /></div>
      ) : cinemas.length === 0 ? (
        <div className="trv-empty">
          <h3>No results</h3>
          <p>No cinemas found near {cityName}.</p>
        </div>
      ) : (
        <div className="trv-venue-grid">
          {cinemas.map((cinema) => (
            <article key={cinema.id} className="trv-venue-card">
              <button type="button" className="trv-fav" onClick={() => toggleFavorite(cinema)} aria-label="Toggle favorite">
                {favorites.some((fav) => fav.id === cinema.id) ? "❤️" : "🤍"}
              </button>
              <img src={cinema.image} alt={cinema.name} className="trv-venue-image" loading="lazy" decoding="async" />
              <div className="trv-venue-body">
                <h3>{cinema.name}</h3>
                <p className="trv-venue-meta">
                  <strong>Type:</strong> {cinema.type}
                </p>
                <p className="trv-venue-meta">{cinema.description}</p>
                <p className="trv-venue-meta">
                  <strong>Opening Hours:</strong> {cinema.openingHours}
                </p>
                <button type="button" className="trv-btn trv-btn-primary" onClick={() => handleViewDetails(cinema.id)}>
                  Explore
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cinemas;
