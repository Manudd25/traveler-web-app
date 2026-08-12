/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../contexts/FavoriteContext";
import { useTripDestination } from "../hooks/useTripDestination";
import { fetchCityImages } from "../utils/fetchCityImages";
import { resolveTripCover } from "../utils/tripCovers";

const romeFallbacks = [
  {
    id: "rome-colosseum",
    name: "Colosseum Guided Tour",
    type: "Historical",
    description: "Experience the grandeur of the Colosseum with a professional guide.",
    duration: "2 hours",
    image:
      "https://images.unsplash.com/photo-1699012462295-bace478f27bc?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "rome-vatican",
    name: "Vatican Museums and Sistine Chapel",
    type: "Cultural",
    description: "Explore the Vatican Museums and Michelangelo's masterpiece.",
    duration: "3 hours",
    image:
      "https://images.unsplash.com/photo-1593548615306-d1db319843b6?w=500&auto=format&fit=crop&q=60",
  },
];

const lisbonFallbacks = [
  {
    id: "lisbon-old-town",
    name: "Lisbon Old Town Walking Tour",
    type: "Walking Tour",
    description: "Explore Alfama and the historic centre with a local guide.",
    duration: "2.5 hours",
    image:
      "https://cdn.pixabay.com/photo/2019/10/08/18/59/lisbon-4535489_640.jpg",
  },
  {
    id: "lisbon-belem",
    name: "Belém Highlights Tour",
    type: "Historical",
    description: "Visit Belém Tower, Jerónimos Monastery, and taste Pastéis de Belém.",
    duration: "3 hours",
    image:
      "https://cdn.pixabay.com/photo/2018/02/27/16/25/portugal-3186174_640.jpg",
  },
  {
    id: "lisbon-food",
    name: "Lisbon Food & Wine Tour",
    type: "Culinary",
    description: "Taste traditional Portuguese dishes and wines with a local host.",
    duration: "3 hours",
    image:
      "https://cdn.pixabay.com/photo/2016/11/14/03/38/lisbon-1822534_640.jpg",
  },
];

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const { cityName, around, tripKey, ready } = useTripDestination();

  useEffect(() => {
    if (!ready) return;

    const fetchTours = async () => {
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
            node["tourism"="attraction"]${around};
            node["tourism"="museum"]${around};
            node["historic"]${around};
            node["tourism"="information"]["information"="guide"]${around};
          );
          out body;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        const images = await fetchCityImages(`${cityName} landmark travel`, {
          perPage: 15,
        });
        const cityCover = resolveTripCover({ city: cityName, destination: cityName });
        const pickImage = (index, fallbackUrl) =>
          images[index % Math.max(images.length, 1)] ||
          fallbackUrl ||
          cityCover ||
          "https://via.placeholder.com/400x300?text=No+Image";

        let formattedData = (data.elements || [])
          .filter((t) => t.tags?.name)
          .slice(0, 15)
          .map((tour, index) => ({
            id: tour.id,
            name: tour.tags?.name || `Guided Tour in ${cityName}`,
            type: tour.tags?.tourism || tour.tags?.historic || "Tour",
            description:
              tour.tags?.description ||
              `Explore ${cityName} with a professional guide.`,
            duration: tour.tags?.duration || "Flexible Timing",
            image: pickImage(index),
            city: cityName,
          }));

        if (formattedData.length === 0) {
          formattedData = fallbacks.map((tour, index) => ({
            ...tour,
            city: cityName,
            image: pickImage(index, tour.image),
          }));
        }

        setTours(formattedData);
      } catch (error) {
        console.error("Error fetching tour data:", error);
        const images = await fetchCityImages(`${cityName} landmark travel`, {
          perPage: 8,
        }).catch(() => []);
        const cityCover = resolveTripCover({ city: cityName, destination: cityName });
        setTours(
          fallbacks.map((tour, index) => ({
            ...tour,
            city: cityName,
            image:
              images[index % Math.max(images.length, 1)] ||
              tour.image ||
              cityCover,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [ready, tripKey, around, cityName]);

  const handleViewDetails = (tour) => {
    navigate(`/tour-details/${tour.id}`, {
      state: { cityName, tour },
    });
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Guided Tours</h1>
          <p>Near {cityName} · based on your active trip</p>
        </div>
      </div>

      {loading ? (
        <div className="trv-loading"><img src="/loading.gif" alt="Loading" /></div>
      ) : tours.length === 0 ? (
        <div className="trv-empty">
          <h3>No results</h3>
          <p>No tours found near {cityName}.</p>
        </div>
      ) : (
        <div className="trv-venue-grid">
          {tours.map((tour) => (
            <article key={tour.id} className="trv-venue-card">
              <button type="button" className="trv-fav" onClick={() => toggleFavorite(tour)} aria-label="Toggle favorite">
                {favorites.some((fav) => fav.id === tour.id) ? "❤️" : "🤍"}
              </button>
              <img src={tour.image} alt={tour.name} className="trv-venue-image" loading="lazy" decoding="async" />
              <div className="trv-venue-body">
                <h3>{tour.name}</h3>
                <p className="trv-venue-meta">
                  <strong>Type:</strong> {tour.type}
                </p>
                <p className="trv-venue-meta">{tour.description}</p>
                <p className="trv-venue-meta">
                  <strong>Duration:</strong> {tour.duration}
                </p>
                <button type="button" className="trv-btn trv-btn-primary" onClick={() => handleViewDetails(tour)}>
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

export default Tours;
