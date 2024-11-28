/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CinemaPage.css";

const CinemaPage = () => {
  const { cinemaId } = useParams(); // Assuming cinemaId can be used to filter movies if needed
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cinemaName, setCinemaName] = useState("Cinema"); // Default cinema name
  const [showMoreStates, setShowMoreStates] = useState({}); // Tracks "Read More" states for movies
  const navigate = useNavigate();


  const TMDB_API_KEY = "17bd342bc110828c583eadb704c47710";

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.results) {
          setMovies(data.results);
          setCinemaName("Movies Now Playing");
        }
      } catch (error) {
        console.error("Error fetching movies from TMDb:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderOverview = (overview, movieId) => {
    if (!overview) return "No description available.";
  
    const isExpanded = showMoreStates[movieId]; // Check if this movie's "Read More" is expanded
    const words = overview.split(" "); // Split the text into words
    const shortOverview = words.length > 4 ? `${words.slice(0, 4).join(" ")}` : overview; // Limit to 4 words
  
    return (
      <>
        <span className={isExpanded ? "expandable" : ""}>
          {isExpanded ? overview : shortOverview} {/* Show full or truncated overview */}
        </span>
        {words.length > 4 && ( // Show "Read More" only if more than 4 words
          <button
            onClick={() =>
              setShowMoreStates((prev) => ({
                ...prev,
                [movieId]: !prev[movieId], // Toggle expanded state
              }))
            }
            className="read-more-btn"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </>
    );
  };


  const handleBooking = (bookingId, movieTitle) => {
    navigate(`/cinema-booking-details/${bookingId}`, {
      state: {cinemaName: cinemaName, movieTitle: movieTitle}
    })
  }

  return (
    <div className="cinema-page-container">
      <h2>{cinemaName}</h2>

      {loading ? (
        <img
          src="/loading.gif"
          style={{ width: "300px", background: "#eef6ff" }}
          alt="loading"
        />
      ) : movies.length === 0 ? (
        <p>No movies currently playing at this cinema.</p>
      ) : (
        <div className="movies-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>
                  <strong>Release Date:</strong> {movie.release_date || "N/A"}
                </p>
                <p>
                  <strong>Overview:</strong> {renderOverview(movie.overview, movie.id)}

                </p>
                <div className="show-hours">
                  <strong>Showtimes:</strong>
                  <ul>
                    <li>1:00 PM</li>
                    <li>4:00 PM</li>
                    <li>7:30 PM</li>
                  </ul>
                </div>
                <button onClick={() => handleBooking(movie.id, movie.title)} className="book-seat-btn">Book a Seat</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CinemaPage;