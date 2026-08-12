import { useMemo, useState } from "react";
import { useTrip } from "../../contexts/TripContext";
import TripCard from "../../components/trip/TripCard";
import { getTripStatus } from "../../utils/tripHelpers";
import { matchCityCover, resolveTripCover } from "../../utils/tripCovers";

const emptyForm = {
  destination: "",
  city: "",
  country: "",
  startDate: "",
  endDate: "",
  travelers: 2,
  budgetTotal: 1000,
  accommodation: "",
  flightStatus: "Not booked",
};

const FORM_FIELDS = [
  ["destination", "Destination", "text", true],
  ["city", "City", "text", false],
  ["country", "Country", "text", false],
  ["startDate", "Start date", "date", true],
  ["endDate", "End date", "date", true],
  ["travelers", "Travelers", "number", false],
  ["budgetTotal", "Budget total", "number", false],
  ["accommodation", "Accommodation", "text", false],
  ["flightStatus", "Flight status", "text", false],
];

export default function MyTrips() {
  const { trips, activeTripId, selectTrip, createTrip, updateTrip, deleteTrip } = useTrip();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("all");

  const filtered = trips.filter((t) => (filter === "all" ? true : getTripStatus(t) === filter));

  const coverPreview = useMemo(
    () => resolveTripCover(form),
    [form.city, form.destination]
  );
  const hasBundledCover = Boolean(matchCityCover(form));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (trip) => {
    setEditingId(trip.id);
    setForm({
      destination: trip.destination || "",
      city: trip.city || "",
      country: trip.country || "",
      startDate: trip.startDate || "",
      endDate: trip.endDate || "",
      travelers: trip.travelers || 1,
      budgetTotal: trip.budgetTotal || 0,
      accommodation: trip.accommodation || "",
      flightStatus: trip.flightStatus || "Not booked",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      travelers: Number(form.travelers) || 1,
      budgetTotal: Number(form.budgetTotal) || 0,
      destination:
        form.destination ||
        [form.city, form.country].filter(Boolean).join(", ") ||
        "Untitled trip",
      city: form.city || form.destination.split(",")[0]?.trim() || "",
    };

    if (editingId) updateTrip(editingId, payload);
    else createTrip(payload);

    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>My Trips</h1>
          <p>Upcoming, current, and past trips in one place.</p>
        </div>
        <button type="button" className="trv-btn trv-btn-primary" onClick={openCreate}>
          New trip
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {["all", "upcoming", "current", "past"].map((f) => (
          <button
            key={f}
            type="button"
            className={`trv-btn ${filter === f ? "trv-btn-primary" : "trv-btn-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <form className="trv-card" style={{ marginBottom: "1.25rem" }} onSubmit={handleSubmit}>
          <h3
            style={{
              marginTop: 0,
              color: "var(--trv-navy)",
              fontFamily: "var(--trv-display)",
              fontSize: "1.2rem",
            }}
          >
            {editingId ? "Edit trip" : "Create trip"}
          </h3>

          <div
            style={{
              height: 140,
              borderRadius: 12,
              marginBottom: "1rem",
              backgroundImage: `linear-gradient(180deg, rgba(13,27,42,0.2), rgba(13,27,42,0.55)), url(${coverPreview})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "flex-end",
              padding: "0.85rem 1rem",
              color: "#fff",
            }}
          >
            <div>
              <strong style={{ fontFamily: "var(--trv-display)", fontSize: "1.15rem" }}>
                {form.city || form.destination || "New destination"}
              </strong>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", opacity: 0.9 }}>
                {hasBundledCover
                  ? "Cover photo matched from your city assets"
                  : "Using default cover — add a matching city photo in assets to customize"}
              </p>
            </div>
          </div>

          <div className="trv-form-grid trv-grid trv-grid-2">
            {FORM_FIELDS.map(([key, label, type, required]) => (
              <div className="trv-field" key={key}>
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  required={required}
                  placeholder={
                    key === "city"
                      ? "e.g. Lisbon or Rome"
                      : key === "destination"
                        ? "e.g. Lisbon, Portugal"
                        : undefined
                  }
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="submit" className="trv-btn trv-btn-primary">
              Save
            </button>
            <button
              type="button"
              className="trv-btn trv-btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="trv-empty">
          <h3>No trips here yet</h3>
          <p>Create your first trip to organize itinerary, bookings, and budget.</p>
          <button type="button" className="trv-btn trv-btn-primary" onClick={openCreate}>
            Create trip
          </button>
        </div>
      ) : (
        <div className="trv-grid trv-grid-3">
          {filtered.map((trip) => (
            <div key={trip.id}>
              <TripCard
                trip={trip}
                active={trip.id === activeTripId}
                onSelect={selectTrip}
              />
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="trv-btn trv-btn-secondary"
                  onClick={() => openEdit(trip)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="trv-btn trv-btn-danger"
                  onClick={() => {
                    if (window.confirm(`Delete trip “${trip.destination}”?`)) {
                      deleteTrip(trip.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
