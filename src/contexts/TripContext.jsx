/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BOOKING_TYPES, uid } from "../data/constants";
import { seedLisbonTrip, seedRomeWeekend, createEmptyTrip } from "../data/seedTrips";
import { dayNumberFromDate } from "../utils/tripHelpers";
import { withTripCover } from "../utils/tripCovers";

const STORAGE_KEY = "traveler_trips_v2";
const ACTIVE_KEY = "traveler_active_trip_v2";

const TripContext = createContext(null);

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [seedLisbonTrip(), seedRomeWeekend()];
};

const expenseCategoryForBooking = (type) => {
  if (type === BOOKING_TYPES.CINEMA) return "activities";
  if (type === BOOKING_TYPES.RESTAURANT) return "food";
  if (type === BOOKING_TYPES.ACTIVITY) return "activities";
  return "other";
};

const itineraryCategoryForBooking = (type) => {
  if (type === BOOKING_TYPES.CINEMA) return "cinema";
  if (type === BOOKING_TYPES.RESTAURANT) return "restaurant";
  if (type === BOOKING_TYPES.ACTIVITY) return "activity";
  return "activity";
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(loadInitial);
  const [activeTripId, setActiveTripId] = useState(() => {
    return localStorage.getItem(ACTIVE_KEY) || loadInitial()[0]?.id || null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    if (activeTripId) localStorage.setItem(ACTIVE_KEY, activeTripId);
  }, [activeTripId]);

  const activeTrip = useMemo(
    () => trips.find((t) => t.id === activeTripId) || trips[0] || null,
    [trips, activeTripId]
  );

  const updateTrip = useCallback((tripId, updater) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId) return trip;
        const next =
          typeof updater === "function" ? updater(trip) : { ...trip, ...updater };
        return {
          ...withTripCover(next),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const createTrip = useCallback((data) => {
    const trip = createEmptyTrip(
      withTripCover({
        ...data,
        checklist: data.checklist || [
          { id: uid("chk"), label: "Flight booked", completed: false },
          { id: uid("chk"), label: "Accommodation booked", completed: false },
          { id: uid("chk"), label: "Passport checked", completed: false },
          { id: uid("chk"), label: "Travel insurance", completed: false },
          { id: uid("chk"), label: "Airport transfer", completed: false },
          { id: uid("chk"), label: "Download offline maps", completed: false },
          { id: uid("chk"), label: "Restaurant reservation", completed: false },
        ],
      })
    );
    setTrips((prev) => [trip, ...prev]);
    setActiveTripId(trip.id);
    return trip;
  }, []);

  const deleteTrip = useCallback(
    (tripId) => {
      setTrips((prev) => {
        const next = prev.filter((t) => t.id !== tripId);
        if (activeTripId === tripId) {
          setActiveTripId(next[0]?.id || null);
        }
        return next;
      });
    },
    [activeTripId]
  );

  const selectTrip = useCallback((tripId) => {
    setActiveTripId(tripId);
  }, []);

  const addItineraryItem = useCallback(
    (tripId, item) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        itinerary: [
          ...(trip.itinerary || []),
          { id: uid("itin"), bookingStatus: "planned", price: 0, ...item },
        ],
      }));
    },
    [updateTrip]
  );

  const updateItineraryItem = useCallback(
    (tripId, itemId, patch) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        itinerary: (trip.itinerary || []).map((i) =>
          i.id === itemId ? { ...i, ...patch } : i
        ),
      }));
    },
    [updateTrip]
  );

  const removeItineraryItem = useCallback(
    (tripId, itemId) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        itinerary: (trip.itinerary || []).filter((i) => i.id !== itemId),
      }));
    },
    [updateTrip]
  );

  const addExpense = useCallback(
    (tripId, expense) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        expenses: [
          ...(trip.expenses || []),
          {
            id: uid("exp"),
            date: new Date().toISOString().slice(0, 10),
            ...expense,
          },
        ],
      }));
    },
    [updateTrip]
  );

  const removeExpense = useCallback(
    (tripId, expenseId) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        expenses: (trip.expenses || []).filter((e) => e.id !== expenseId),
      }));
    },
    [updateTrip]
  );

  const toggleChecklistItem = useCallback(
    (tripId, itemId) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        checklist: (trip.checklist || []).map((c) =>
          c.id === itemId ? { ...c, completed: !c.completed } : c
        ),
      }));
    },
    [updateTrip]
  );

  const addChecklistItem = useCallback(
    (tripId, label) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        checklist: [
          ...(trip.checklist || []),
          { id: uid("chk"), label, completed: false },
        ],
      }));
    },
    [updateTrip]
  );

  const removeChecklistItem = useCallback(
    (tripId, itemId) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        checklist: (trip.checklist || []).filter((c) => c.id !== itemId),
      }));
    },
    [updateTrip]
  );

  const addDocument = useCallback(
    (tripId, doc) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        documents: [
          ...(trip.documents || []),
          { id: uid("doc"), status: "pending", notes: "", ...doc },
        ],
      }));
    },
    [updateTrip]
  );

  const removeDocument = useCallback(
    (tripId, docId) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        documents: (trip.documents || []).filter((d) => d.id !== docId),
      }));
    },
    [updateTrip]
  );

  const addPlace = useCallback(
    (tripId, place) => {
      updateTrip(tripId, (trip) => ({
        ...trip,
        places: [...(trip.places || []), { id: uid("plc"), ...place }],
      }));
    },
    [updateTrip]
  );

  /**
   * Confirm a simulated booking and sync itinerary + budget in one write.
   * payload shape:
   * {
   *   type: 'cinema'|'restaurant'|'activity',
   *   title, date, time, totalPrice, currency?,
   *   location?, notes?, coordinates?,
   *   details: { ...type-specific },
   *   addToItinerary?: boolean (default true),
   *   addExpense?: boolean (default true),
   * }
   */
  const confirmBooking = useCallback(
    (tripId, payload) => {
      const bookingId = uid("bk");
      const booking = {
        id: bookingId,
        type: payload.type,
        title: payload.title,
        date: payload.date || "",
        time: payload.time || "",
        totalPrice: Number(payload.totalPrice) || 0,
        currency: payload.currency || "EUR",
        location: payload.location || "",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        details: payload.details || {},
        demo: true,
      };

      updateTrip(tripId, (trip) => {
        const next = {
          ...trip,
          bookings: [booking, ...(trip.bookings || [])],
        };

        if (payload.addExpense !== false && booking.totalPrice > 0) {
          next.expenses = [
            ...(trip.expenses || []),
            {
              id: uid("exp"),
              category: expenseCategoryForBooking(payload.type),
              title: payload.title,
              amount: booking.totalPrice,
              date: payload.date || new Date().toISOString().slice(0, 10),
              bookingId,
            },
          ];
        }

        if (payload.addToItinerary !== false) {
          const day = dayNumberFromDate(trip.startDate, payload.date);
          next.itinerary = [
            ...(trip.itinerary || []),
            {
              id: uid("itin"),
              day,
              dayLabel: `Day ${day}`,
              time: payload.time || "19:00",
              title: payload.title,
              category: itineraryCategoryForBooking(payload.type),
              location: payload.location || "",
              notes: payload.notes || "Confirmed demo booking",
              price: booking.totalPrice,
              bookingStatus: "confirmed",
              bookingId,
              coordinates: payload.coordinates || null,
            },
          ];
        }

        // Mark related checklist items when restaurant/activity booked
        if (payload.type === BOOKING_TYPES.RESTAURANT) {
          next.checklist = (trip.checklist || []).map((c) =>
            /restaurant/i.test(c.label) ? { ...c, completed: true } : c
          );
        }

        if (payload.coordinates) {
          next.places = [
            ...(trip.places || []),
            {
              id: uid("plc"),
              name: payload.title,
              category: itineraryCategoryForBooking(payload.type),
              coordinates: payload.coordinates,
              notes: "From confirmed booking",
              bookingId,
            },
          ];
        }

        return next;
      });

      return booking;
    },
    [updateTrip]
  );

  const value = {
    trips,
    activeTrip,
    activeTripId,
    selectTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    addItineraryItem,
    updateItineraryItem,
    removeItineraryItem,
    addExpense,
    removeExpense,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    addDocument,
    removeDocument,
    addPlace,
    confirmBooking,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
};
