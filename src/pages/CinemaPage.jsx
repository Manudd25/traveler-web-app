/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CinemaPage = () => {
  const { cinemaId } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cinemaName, setCinemaName] = useState("Cinema");
  const [showMoreStates, setShowMoreStates] = useState({});
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

    const isExpanded = showMoreStates[movieId];
    const words = overview.split(" ");
    const shortOverview = words.length > 4 ? `${words.slice(0, 4).join(" ")}` : overview;

    return (
      <>
        <span className={isExpanded ? "expandable" : ""}>
          {isExpanded ? overview : shortOverview}
        </span>
        {words.length > 4 && (
          <button
            type="button"
            onClick={() =>
              setShowMoreStates((prev) => ({
                ...prev,
                [movieId]: !prev[movieId],
              }))
            }
            className="trv-btn"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </>
    );
  };

  const handleBooking = (bookingId, movieTitle) => {
    navigate(`/cinema-booking-details/${bookingId}`, {
      state: { cinemaName: cinemaName, movieTitle: movieTitle },
    });
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>{cinemaName}</h1>
          <p>Now playing · book your seat</p>
        </div>
      </div>

      {loading ? (
        <div className="trv-loading"><img src="/loading.gif" alt="Loading" /></div>
      ) : movies.length === 0 ? (
        <div className="trv-empty">
          <h3>No results</h3>
          <p>No movies currently playing at this cinema.</p>
        </div>
      ) : (
        <div className="trv-venue-grid">
          {movies.map((movie) => (
            <article key={movie.id} className="trv-venue-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
                className="trv-venue-image"
                loading="lazy"
                decoding="async"
              />
              <div className="trv-venue-body">
                <h3>{movie.title}</h3>
                <p className="trv-venue-meta">
                  <strong>Release Date:</strong> {movie.release_date || "N/A"}
                </p>
                <p className="trv-venue-meta">
                  <strong>Overview:</strong> {renderOverview(movie.overview, movie.id)}
                </p>
                <p className="trv-venue-meta">
                  <strong>Showtimes:</strong> 1:00 PM · 4:00 PM · 7:30 PM
                </p>
                <button
                  type="button"
                  onClick={() => handleBooking(movie.id, movie.title)}
                  className="trv-btn trv-btn-primary"
                >
                  Book a Seat
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default CinemaPage;
