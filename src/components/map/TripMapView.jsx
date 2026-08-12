/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN } from "../../utils/mapboxToken";

const CATEGORY_COLORS = {
  accommodation: "#db2777",
  attraction: "#d97706",
  restaurant: "#ea580c",
  cinema: "#7c3aed",
  airport: "#2563eb",
  transport: "#4f46e5",
  activity: "#059669",
};

export default function TripMapView({ places = [], height = 480, initialCenter }) {
  const markers = useMemo(
    () =>
      places.filter(
        (p) =>
          p.coordinates &&
          typeof p.coordinates.lat === "number" &&
          typeof p.coordinates.lng === "number"
      ),
    [places]
  );

  const center = initialCenter || {
    longitude: markers[0]?.coordinates.lng ?? 12.4964,
    latitude: markers[0]?.coordinates.lat ?? 41.9028,
  };

  const [popup, setPopup] = useState(null);

  return (
    <div style={{ borderRadius: "var(--trv-radius)", overflow: "hidden", border: "1px solid var(--trv-border)" }}>
      <Map
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom: 12,
        }}
        style={{ width: "100%", height }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />
        {markers.map((place) => (
          <Marker
            key={place.id}
            longitude={place.coordinates.lng}
            latitude={place.coordinates.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopup(place);
            }}
          >
            <button
              type="button"
              aria-label={`${place.name} (${place.category})`}
              style={{
                background: CATEGORY_COLORS[place.category] || "#0b2c4a",
                color: "#fff",
                border: "2px solid #fff",
                borderRadius: "50%",
                width: 28,
                height: 28,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {place.category?.[0]?.toUpperCase() || "P"}
            </button>
          </Marker>
        ))}

        {popup && (
          <Popup
            longitude={popup.coordinates.lng}
            latitude={popup.coordinates.lat}
            anchor="top"
            onClose={() => setPopup(null)}
            closeOnClick={false}
          >
            <div style={{ color: "#1a2b3c", minWidth: 140 }}>
              <strong>{popup.name}</strong>
              <div style={{ fontSize: 12, marginTop: 4, textTransform: "capitalize" }}>
                {popup.category}
              </div>
              {popup.notes && (
                <p style={{ margin: "6px 0 0", fontSize: 12 }}>{popup.notes}</p>
              )}
            </div>
          </Popup>
        )}
      </Map>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem 1rem",
          padding: "0.75rem 1rem",
          background: "#fff",
          fontSize: "0.78rem",
          color: "var(--trv-muted)",
        }}
      >
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
                display: "inline-block",
              }}
            />
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
