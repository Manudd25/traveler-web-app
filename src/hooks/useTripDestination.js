import { useEffect, useState } from "react";
import { useTrip } from "../contexts/TripContext";
import {
  destinationLabel,
  getTripGeoSync,
  overpassAround,
  resolveTripGeo,
} from "../utils/destinationGeo";

/**
 * Provides destination geo for the active trip and refetches when the trip changes.
 */
export function useTripDestination() {
  const { activeTrip } = useTrip();
  const [geo, setGeo] = useState(() => getTripGeoSync(activeTrip));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    (async () => {
      const resolved = await resolveTripGeo(activeTrip);
      if (!cancelled) {
        setGeo(resolved);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTrip?.id, activeTrip?.city, activeTrip?.destination, activeTrip?.country]);

  return {
    trip: activeTrip,
    geo,
    ready,
    cityName: destinationLabel(activeTrip, geo),
    around: overpassAround(geo),
    tripKey: `${activeTrip?.id || "none"}-${geo.lat}-${geo.lng}`,
  };
}
