import { useState } from "react";
import "../styles/Entertainment.css";
import { useFavorite } from "../contexts/FavoriteContext";


const Theater = () => {
  const { favorites, toggleFavorite } = useFavorite(); 
  const [shows] = useState([
   
    {
      id: "1",
      name: "Måneskin - Homecoming Show",
      date: "2024-07-05",
      location: "Circus Maximus",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tbWVkaWFuJTIwc3RhZ2V8ZW58MHx8MHx8fDI%3D",
    },
    {
        id: "2",
        name: "Rome: Giuseppe Verdi's 'La Traviata'",
        date: "2024-07-15",
        location: "St Paul's within Walls Church",
        image: "https://plus.unsplash.com/premium_photo-1664302644902-7bf58fa20ef9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhlYXRlcnxlbnwwfHwwfHx8MA%3D%3D"
      },
      {
        id: "3",
        name: "The Romans And Their History Show",
        date: "2024-09-10",
        location: "Circus Maximus",
        image: "https://images.unsplash.com/photo-1588979657249-b704da75d800?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHx0aGVhdGVyfGVufDB8fDB8fHww"
      },
      {
        id: "4",
        name: "Cabaret and Burlesque Show",
        date: "2024-08-21",
        location: "31 Via di Porta Labicana",
        image: "https://plus.unsplash.com/premium_photo-1684923604303-e42ce243b6d4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHRoZWF0ZXJ8ZW58MHx8MHx8fDA%3D"
      },
      {
        id: "5",
        name: "Rome: Gladiator Show and Museum Tickets",
        date: "every day",
        location: "25 Via Nazionale",
        image: "https://images.unsplash.com/photo-1715896024404-f1fe7a8fad33?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxnbGFkaWF0b3J8ZW58MHx8MHx8fDA%3D"
      },
     
  ]);

  

  return (
    <div className="entertainment-container">
      <h2>Entertainment in Rome</h2>

      <section>
        <h3>Upcoming Shows</h3>
        <div className="concert-list">
          {shows.map((show) => (
            <div key={show.id} className="concert-card">
              <div className="favorite-icon" onClick={() => toggleFavorite(show)}>
                    {favorites.some((fav) => fav.id === show.id) ? "❤️" : "🤍"}
                  </div>
              <img
                src={show.image}
                alt={show.name}
                className="concert-image"
              />
              <div className="concert-info">
                <h3>{show.name}</h3>
                <p>
                  <strong>Date:</strong> {show.date}
                </p>
                <p>
                  <strong>Location:</strong> {show.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Theater;
