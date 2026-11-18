import { useState } from "react";
import { Link } from "react-router-dom";
import Map from "react-map-gl";
import MapModal from "../../components/MapModal";
import { useTripDestination } from "../../hooks/useTripDestination";
import { MAPBOX_TOKEN, hasMapboxToken } from "../../utils/mapboxToken";
import restaurant from "../../assets/restaurant.jpg";
import bars from "../../assets/bars.jpg";
import activities from "../../assets/activities.jpg";
import tours from "../../assets/tours.jpg";
import cinema from "../../assets/cinema.jpg";
import entertainment from "../../assets/entertainment.jpg";

const categories = [
  {
    to: "/restaurants",
    title: "Restaurants",
    text: "Find dining experiences and book a table.",
    image: restaurant,
  },
  {
    to: "/restaurants/bars",
    title: "Bars & Pubs",
    text: "Unwind with the perfect drink.",
    image: bars,
  },
  {
    to: "/activities",
    title: "Sports & Activities",
    text: "Stay active and entertained.",
    image: activities,
  },
  {
    to: "/activities/tours",
    title: "Tours & Excursions",
    text: "Explore guided tours and adventures.",
    image: tours,
  },
  {
    to: "/entertainment/cinemas",
    title: "Cinemas & Theaters",
    text: "Catch movies with interactive seat booking.",
    image: cinema,
  },
  {
    to: "/entertainment",
    title: "Entertainment",
    text: "Enjoy music, festivals, and events.",
    image: entertainment,
  },
];

export default function Discover() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { cityName, geo, ready } = useTripDestination();

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Discover</h1>
          <p>
            Browse venues near <strong>{cityName}</strong> from your active trip.
          </p>
        </div>
      </div>

      <div className="trv-card" style={{ marginBottom: "1.25rem", padding: "1rem" }}>
        <h3 style={{ marginTop: 0, color: "var(--trv-navy)" }}>
          Destination map — {cityName}
        </h3>
        <div
          className="map-container"
          onClick={() => setModalIsOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setModalIsOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Open larger map"
          style={{ cursor: "pointer", marginTop: "0.75rem" }}
        >
          {ready &&
            (hasMapboxToken ? (
              <Map
                key={`${geo.lat}-${geo.lng}`}
                initialViewState={{
                  longitude: geo.lng,
                  latitude: geo.lat,
                  zoom: 12,
                }}
                style={{ width: "100%", height: 260, borderRadius: 8 }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
              />
            ) : (
              <p className="trv-empty" style={{ padding: "1rem" }}>
                Map unavailable. Add <code>MAPBOX_TOKEN</code> to <code>.env</code>.
              </p>
            ))}
        </div>
        <p className="trv-sub" style={{ marginTop: "0.65rem" }}>
          Results in Restaurants, Tours, Cinemas and Activities follow this destination.
        </p>
      </div>

      <div className="trv-grid trv-grid-3">
        {categories.map((cat) => (
          <Link
            key={cat.to}
            to={cat.to}
            className="trv-card"
            style={{
              textDecoration: "none",
              minHeight: 160,
              backgroundImage: `linear-gradient(180deg, rgba(11,44,74,0.15), rgba(11,44,74,0.78)), url(${cat.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontFamily: "var(--trv-display)",
                fontSize: "1.25rem",
              }}
            >
              {cat.title}
            </h3>
            <p style={{ margin: "0.35rem 0 0", color: "rgba(255,255,255,0.9)", fontSize: "0.88rem" }}>
              {cat.text}
            </p>
          </Link>
        ))}
      </div>

      <MapModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        latitude={geo.lat}
        longitude={geo.lng}
        title={`Explore ${cityName}`}
      />
    </div>
  );
}
