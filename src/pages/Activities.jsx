/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Activities.css";
import { useFavorite } from "../contexts/FavoriteContext";


const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorite(); 


  const fallbackSports = [
    {
      id: "1",
      name: "Yoga Session at Villa Borghese",
      type: "Yoga",
      openingHours: "Every Morning at 7:00 AM",
      image: "https://images.unsplash.com/photo-1561577732-12fffa81b37e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHlvZ2ElMjBhdCUyMHBhcmt8ZW58MHx8MHx8fDI%3D",
    },
    {
      id: "2",
      name: "Soccer Match at Villa Doria Paphili",
      type: "Soccer",
      openingHours: "Evenings, 5:00 PM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1680762377870-9ff8865f2b20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjMxfHxmb290YmFsbCUyMGZyaWVuZGx5fGVufDB8fDB8fHwy",
    },
    {
      id: "3",
      name: "Tennis at Foro Italico",
      type: "Tennis",
      openingHours: "9:00 AM - 9:00 PM",
      image: "https://images.unsplash.com/photo-1638444889769-ae6d9369e61d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Rm9ybyUyMEl0YWxpY298ZW58MHx8MHx8fDI%3D",
    },
    {
      id: "4",
      name: "Cycling Along the Appian Way",
      type: "Cycling",
      openingHours: "Open All Day",
      image: "https://images.unsplash.com/photo-1723228565967-34e093a85317?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VmlhJTIwQXBwaWF8ZW58MHx8MHx8fDI%3D",
    },
    {
      id: "5",
      name: "Basketball Game at Testaccio",
      type: "Basketball",
      openingHours: "Afternoons, 3:00 PM - 6:00 PM",
      image: "https://images.unsplash.com/photo-1523703591032-c582f1eedf32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fGJhc2tldGJhbGx8ZW58MHx8MHx8fDI%3D",
    },
  ];

  const getNearbyLocation = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return (
        data.address?.neighbourhood ||
        data.address?.suburb ||
        data.address?.city ||
        "Unknown Location"
      );
    } catch {
      return "Unknown Location";
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);

      try {
        // Overpass API query for activities and sports
        const query = `
          [out:json];
          (
            node["leisure"](41.8902,12.4922,41.9029,12.5000);
            node["tourism"~"museum|gallery|attraction|viewpoint"](41.8902,12.4922,41.9029,12.5000);
            node["sport"](41.8902,12.4922,41.9029,12.5000);
            node["historic"](41.8902,12.4922,41.9029,12.5000);
          );
          node["tourism"="hotel"](41.8902,12.4922,41.9029,12.5000) -> .exclude;
          (
            ._;
            - .exclude;
          );
          out body;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        // Fetch activity images from Pixabay API
        const imageResponse = await fetch(
          `https://pixabay.com/api/?key=47226052-b8804eb501d7ae68ad2a6da9e&q=Rome+Activities&image_type=photo&per_page=15`
        );
        const imageData = await imageResponse.json();
        const images = imageData.hits.map((hit) => hit.webformatURL);

        // Separate sports and other activities
        const sportsData = [];
        const activityData = [];

        const formattedData = await Promise.all(
          data.elements.map(async (item, index) => {
            const type =
              item.tags?.leisure ||
              item.tags?.tourism ||
              item.tags?.sport ||
              "Activity";

            const defaultNames = {
              park: "Public Park",
              museum: "Museum",
              gallery: "Art Gallery",
              attraction: "Tourist Attraction",
              viewpoint: "Scenic Viewpoint",
              soccer: "Soccer Field",
              basketball: "Basketball Court",
              tennis: "Tennis Court",
              historic: "Historic Site",
              gym: "Fitness Center",
            };

            const inferredName =
              defaultNames[type] ||
              `Walk near ${await getNearbyLocation(item.lat, item.lon)}`;

            const activity = {
              id: item.id,
              name: item.tags?.name || inferredName,
              type,
              openingHours: item.tags?.opening_hours || "Open 24/7",
              image: images[index] || "https://via.placeholder.com/400x300?text=No+Image",
            };

            if (item.tags?.sport) {
              sportsData.push(activity);
            } else {
              activityData.push(activity);
            }

            return activity;
          })
        );

        // Filter out duplicates and "Colosseo"
        const seenNames = new Set();
        const uniqueActivities = activityData.filter((activity) => {
          if (seenNames.has(activity.name) || activity.name === "Colosseo") {
            return false;
          }
          seenNames.add(activity.name);
          return true;
        });

        const uniqueSports = sportsData.length > 0 ? sportsData : fallbackSports;

        setActivities(uniqueActivities);
        setSports(uniqueSports);
      } catch (error) {
        console.error("Error fetching activity data:", error);

        // Use fallback sports if an error occurs
        setSports(fallbackSports);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleViewDetails = (activityId) => {
    navigate(`/activity-details/${activityId}`);
  };

  return (
    <div className="activity-container">
      <h2>Activities in Rome</h2>
      {loading ? (
        <img src="/loading.gif" style={{width: "300px", background: "#eef6ff"}} alt="loading" />
      ) : (
        <>
         
          <section>
            <h3>Activities</h3>
            {activities.length === 0 ? (
              <p>No activities found in the specified area.</p>
            ) : (
              <div className="activity-list">
                {activities.map((activity) => (
                  <div key={activity.id} className="activity-card">
                      <div className="favorite-icon" onClick={() => toggleFavorite(activity)}>
                    {favorites.some((fav) => fav.id === activity.id) ? "❤️" : "🤍"}
                  </div>
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="activity-image"
                    />

                    <div className="activity-info">
                      <h3>{activity.name}</h3>
                      <p>
                        <strong>Type:</strong> {activity.type}
                      </p>
                      <p>{activity.openingHours}</p>
                      <button
                        className="explore-btn"
                        onClick={() => handleViewDetails(activity.id)}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Activities;
