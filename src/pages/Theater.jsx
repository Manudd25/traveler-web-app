import { useState } from "react";
import { useFavorite } from "../contexts/FavoriteContext";
import { useTripDestination } from "../hooks/useTripDestination";

const Theater = () => {
  const { favorites, toggleFavorite } = useFavorite();
  const { cityName } = useTripDestination();
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
      image: "https://plus.unsplash.com/premium_photo-1664302644902-7bf58fa20ef9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhlYXRlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "3",
      name: "The Romans And Their History Show",
      date: "2024-09-10",
      location: "Circus Maximus",
      image: "https://images.unsplash.com/photo-1588979657249-b704da75d800?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHx0aGVhdGVyfGVufDB8fDB8fHww",
    },
    {
      id: "4",
      name: "Cabaret and Burlesque Show",
      date: "2024-08-21",
      location: "31 Via di Porta Labicana",
      image: "https://plus.unsplash.com/premium_photo-1684923604303-e42ce243b6d4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHRoZWF0ZXJ8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: "5",
      name: "Rome: Gladiator Show and Museum Tickets",
      date: "every day",
      location: "25 Via Nazionale",
      image: "https://images.unsplash.com/photo-1715896024404-f1fe7a8fad33?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxnbGFkaWF0b3J8ZW58MHx8MHx8fDA%3D",
    },
  ]);

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Theater</h1>
          <p>Near {cityName} · based on your active trip</p>
        </div>
      </div>

      {shows.length === 0 ? (
        <div className="trv-empty">
          <h3>No results</h3>
          <p>No shows found near {cityName}.</p>
        </div>
      ) : (
        <div className="trv-venue-grid">
          {shows.map((show) => (
            <article key={show.id} className="trv-venue-card">
              <button type="button" className="trv-fav" onClick={() => toggleFavorite(show)} aria-label="Toggle favorite">
                {favorites.some((fav) => fav.id === show.id) ? "❤️" : "🤍"}
              </button>
              <img src={show.image} alt={show.name} className="trv-venue-image" loading="lazy" decoding="async" />
              <div className="trv-venue-body">
                <h3>{show.name}</h3>
                <p className="trv-venue-meta">
                  <strong>Date:</strong> {show.date}
                </p>
                <p className="trv-venue-meta">
                  <strong>Location:</strong> {show.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Theater;
