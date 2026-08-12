/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "../contexts/FavoriteContext";
import { useTripDestination } from "../hooks/useTripDestination";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite();
  const { cityName, around, tripKey, ready } = useTripDestination();

  useEffect(() => {
    if (!ready) return;

    const fetchActivities = async () => {
      setLoading(true);

      try {
        const query = `
          [out:json];
          (
            node["tourism"~"museum|gallery|attraction|viewpoint"]${around};
            node["leisure"~"park|garden|sports_centre"]${around};
            node["historic"]${around};
          );
          out body 40;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        const imageResponse = await fetch(
          `https://pixabay.com/api/?key=47226052-b8804eb501d7ae68ad2a6da9e&q=${encodeURIComponent(
            `${cityName} activities`
          )}&image_type=photo&per_page=15`
        );
        const imageData = await imageResponse.json();
        const images = (imageData.hits || []).map((hit) => hit.webformatURL);

        const seen = new Set();
        const formatted = (data.elements || [])
          .map((item, index) => {
            const type =
              item.tags?.tourism ||
              item.tags?.leisure ||
              item.tags?.historic ||
              "Activity";
            const name = item.tags?.name;
            if (!name || seen.has(name)) return null;
            seen.add(name);
            return {
              id: item.id,
              name,
              type,
              openingHours: item.tags?.opening_hours || "Hours vary",
              image: images[index % Math.max(images.length, 1)] ||
                "https://via.placeholder.com/400x300?text=No+Image",
              city: cityName,
            };
          })
          .filter(Boolean)
          .slice(0, 15);

        setActivities(formatted);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [ready, tripKey, around, cityName]);

  const handleViewDetails = (activity) => {
    navigate(`/tour-details/${activity.id}`, {
      state: {
        cityName,
        tour: {
          id: activity.id,
          name: activity.name,
          type: activity.type,
          description: `Discover ${activity.name} in ${cityName}.`,
          duration: "Flexible Timing",
          image: activity.image,
          city: cityName,
        },
      },
    });
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Activities</h1>
          <p>Near {cityName} · based on your active trip</p>
        </div>
      </div>

      {loading ? (
        <div className="trv-loading"><img src="/loading.gif" alt="Loading" /></div>
      ) : (
        <section>
          <h2 className="trv-section-title">Things to do</h2>
          {activities.length === 0 ? (
            <div className="trv-empty">
              <h3>No results</h3>
              <p>No activities found near {cityName}.</p>
            </div>
          ) : (
            <div className="trv-venue-grid">
              {activities.map((activity) => (
                <article key={activity.id} className="trv-venue-card">
                  <button type="button" className="trv-fav" onClick={() => toggleFavorite(activity)} aria-label="Toggle favorite">
                    {favorites.some((fav) => fav.id === activity.id) ? "❤️" : "🤍"}
                  </button>
                  <img src={activity.image} alt={activity.name} className="trv-venue-image" loading="lazy" decoding="async" />
                  <div className="trv-venue-body">
                    <h3>{activity.name}</h3>
                    <p className="trv-venue-meta">
                      <strong>Type:</strong> {activity.type}
                    </p>
                    <p className="trv-venue-meta">{activity.openingHours}</p>
                    <button
                      type="button"
                      className="trv-btn trv-btn-primary"
                      onClick={() => handleViewDetails(activity)}
                    >
                      Explore
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Activities;
