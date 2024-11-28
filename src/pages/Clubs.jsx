/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "../styles/Entertainment.css";
import { useFavorite } from "../contexts/FavoriteContext";


const Entertainment = () => {
  const [discos, setDiscos] = useState([]);
  const [loadingDiscos, setLoadingDiscos] = useState(true);
  const { favorites, toggleFavorite } = useFavorite(); 
 

  const fallbackDiscos = [
    {
      id: "1",
      name: "Club Euphoria",
      description: "A high-energy nightclub with the latest hits and an incredible light show.",
      openingHours: "10:00 PM - 4:00 AM",
      image: "https://images.unsplash.com/photo-1699616409199-97327373efa4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGNsdWIlMjBldXBob3JpYXxlbnwwfHwwfHx8Mg%3D%3D",
    },
    {
      id: "2",
      name: "Groove Palace",
      description: "Dance the night away with groovy beats and a lively atmosphere.",
      openingHours: "9:00 PM - 3:00 AM",
      image: "https://media.istockphoto.com/id/1168159182/de/foto/led-panel-%C3%A4hnliche-virtuelle-lichtarchitektur-digital-generiertes-bild.jpg?s=612x612&w=0&k=20&c=I4QxPS5TWphCsq7hTdCRjqMe1yzdhdRWh7g4BHavH3o=",
    },
    {
      id: "3",
      name: "Velvet Underground",
      description: "A chic disco with a touch of luxury and curated playlists.",
      openingHours: "11:00 PM - 5:00 AM",
      image: "https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  useEffect(() => {
    const fetchDiscos = async () => {
      setLoadingDiscos(true);

      try {
        // Overpass API query for discos in Rome
        const query = `
          [out:json];
          node["amenity"="nightclub"](41.8902,12.4922,41.9029,12.5000);
          out body;
        `;
        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        // Format disco data
        const formattedDiscos = data.elements.slice(0, 10).map((disco, index) => ({
          id: disco.id,
          name: disco.tags?.name || "Unnamed Disco",
          description: disco.tags?.description || "A vibrant place to dance and enjoy music.",
          openingHours: disco.tags?.opening_hours || "Opening hours unavailable.",
          image: fallbackDiscos[index]?.image || "https://via.placeholder.com/400x300?text=No+Image",
        }));

        setDiscos(formattedDiscos.length > 0 ? formattedDiscos : fallbackDiscos);
      } catch (error) {
        console.error("Error fetching disco data:", error);
        setDiscos(fallbackDiscos);
      } finally {
        setLoadingDiscos(false);
      }
    };

    fetchDiscos();
  }, []);

  return (
    <div className="entertainment-container">
      <h2>Entertainment in Rome</h2>

      <section>
        <h3>Discos</h3>
        {loadingDiscos ? (
        <img src="/loading.gif" style={{width: "300px", background: "#eef6ff"}} alt="loading" />

        ) : discos.length === 0 ? (
          <p>No discos found in the specified area.</p>
        ) : (
          <div className="disco-list">
            {discos.map((disco) => (
              <div key={disco.id} className="disco-card">
                <div className="favorite-icon" onClick={() => toggleFavorite(disco)}>
                    {favorites.some((fav) => fav.id === disco.id) ? "❤️" : "🤍"}
                  </div>
                <img
                  src={disco.image}
                  alt={disco.name}
                  className="disco-image"
                />
                <div className="disco-info">
                  <h3>{disco.name}</h3>
                  <p>{disco.description}</p>
                  <p>
                    <strong>Opening Hours:</strong> {disco.openingHours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

   
    </div>
  );
};

export default Entertainment;
