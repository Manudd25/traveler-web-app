import { useTrip } from "../../contexts/TripContext";
import TripMapView from "../../components/map/TripMapView";

export default function MapPage() {
  const { activeTrip } = useTrip();

  if (!activeTrip) {
    return (
      <div className="trv-empty">
        <h3>No trip selected</h3>
        <p>Map markers come from places and itinerary coordinates.</p>
      </div>
    );
  }

  const placesFromItinerary = (activeTrip.itinerary || [])
    .filter((i) => i.coordinates)
    .map((i) => ({
      id: `itin_${i.id}`,
      name: i.title,
      category: i.category === "cinema" ? "cinema" : i.category,
      coordinates: i.coordinates,
      notes: i.location || i.notes,
    }));

  const places = [...(activeTrip.places || []), ...placesFromItinerary];
  const unique = [];
  const seen = new Set();
  places.forEach((p) => {
    const key = `${p.name}-${p.coordinates?.lat}-${p.coordinates?.lng}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  });

  const center = unique[0]
    ? { longitude: unique[0].coordinates.lng, latitude: unique[0].coordinates.lat }
    : activeTrip.city?.toLowerCase() === "lisbon"
      ? { longitude: -9.1393, latitude: 38.7223 }
      : { longitude: 12.4964, latitude: 41.9028 };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Map</h1>
          <p>Places for {activeTrip.destination}.</p>
        </div>
      </div>

      {unique.length === 0 ? (
        <div className="trv-empty" style={{ marginBottom: "1rem" }}>
          <h3>No mapped places yet</h3>
          <p>Add itinerary items with coordinates, or confirm bookings that include a location.</p>
        </div>
      ) : null}

      <TripMapView places={unique} initialCenter={center} height={520} />
    </div>
  );
}
