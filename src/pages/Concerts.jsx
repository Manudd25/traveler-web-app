import { useState } from "react";
import "../styles/Entertainment.css";
import { useFavorite } from "../contexts/FavoriteContext";


const Concerts = () => {

  const { favorites, toggleFavorite } = useFavorite(); 
  const [concerts] = useState([
    {
      id: "1",
      name: "Coldplay - Music of the Spheres Tour",
      date: "2024-05-20",
      location: "Stadio Olimpico",
      image: "https://images.unsplash.com/photo-1618901882475-4a8ce888ffda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sZHBsYXklMjBjb25jZXJ0fGVufDB8fDB8fHwy",
    },
    {
      id: "2",
      name: "Andrea Bocelli - Live in Rome",
      date: "2024-06-15",
      location: "Terme di Caracalla",
      image: "https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xhc3NpY2FsJTIwbXVzaWMlMjBjb25jZXJ0fGVufDB8fDB8fHwy",
    },
    {
      id: "4",
      name: "Elton John - Farewell Yellow Brick Road",
      date: "2024-08-10",
      location: "Auditorium Parco della Musica",
      image: "https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWx0aG9uJTIwam9obiUyMGNvbmNlcnR8ZW58MHx8MHx8fDI%3D",
    },
  ]);

    
  return (
    <div className="entertainment-container">
      <h2>Entertainment in Rome</h2>



      <section>
        <h3>Upcoming Concerts</h3>
        <div className="concert-list">
          {concerts.map((concert) => (
            <div key={concert.id} className="concert-card">
              <div className="favorite-icon" onClick={() => toggleFavorite(concert)}>
                    {favorites.some((fav) => fav.id === concert.id) ? "❤️" : "🤍"}
                  </div>
              <img
                src={concert.image}
                alt={concert.name}
                className="concert-image"
              />
              <div className="concert-info">
                <h3>{concert.name}</h3>
                <p>
                  <strong>Date:</strong> {concert.date}
                </p>
                <p>
                  <strong>Location:</strong> {concert.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Concerts;
