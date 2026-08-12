import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTrip } from "../../contexts/TripContext";
import DemoDisclaimer from "../../components/bookings/DemoDisclaimer";
import { formatCurrencyExact } from "../../utils/tripHelpers";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "restaurant", label: "Restaurants" },
  { id: "activity", label: "Tours" },
  { id: "cinema", label: "Cinemas" },
];

const TYPE_ICON = {
  cinema: "fa-film",
  restaurant: "fa-utensils",
  activity: "fa-hiking",
};

const TYPE_LABEL = {
  cinema: "Cinema",
  restaurant: "Restaurant",
  activity: "Tour",
};

export default function BookingsHub() {
  const { activeTrip } = useTrip();
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const bookings = useMemo(() => activeTrip?.bookings || [], [activeTrip?.bookings]);

  const filtered = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.type === filter)),
    [bookings, filter]
  );

  const selected =
    filtered.find((b) => b.id === selectedId) || filtered[0] || null;

  if (!activeTrip) {
    return (
      <div className="trv-empty">
        <h3>No trip selected</h3>
        <p>Select a trip to store booking simulations.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Bookings</h1>
          <p>Simulated reservations for {activeTrip.destination}.</p>
        </div>
      </div>

      <div className="bk-sim-links">
        <Link to="/restaurants" className="trv-btn trv-btn-secondary">
          <i className="fas fa-utensils" aria-hidden="true" /> Restaurant table
        </Link>
        <Link to="/entertainment/cinemas" className="trv-btn trv-btn-secondary">
          <i className="fas fa-film" aria-hidden="true" /> Cinema seats
        </Link>
        <Link to="/activities/tours" className="trv-btn trv-btn-secondary">
          <i className="fas fa-hiking" aria-hidden="true" /> Activity / tour
        </Link>
      </div>
      <DemoDisclaimer className="bk-disclaimer" />

      <div className="bk-filters" role="tablist" aria-label="Filter bookings">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`bk-filter ${filter === f.id ? "active" : ""}`}
            onClick={() => {
              setFilter(f.id);
              setSelectedId(null);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="trv-empty">
          <h3>No bookings yet</h3>
          <p>Run a cinema, restaurant, or tour simulation to add one here.</p>
        </div>
      ) : (
        <div className="bk-layout">
          <div>
            {filtered.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`bk-list-card ${selected?.id === b.id ? "active" : ""}`}
                onClick={() => setSelectedId(b.id)}
              >
                <div className="bk-thumb">
                  <i className={`fas ${TYPE_ICON[b.type] || "fa-ticket-alt"}`} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="bk-list-title">{b.title}</h3>
                  <p className="bk-list-meta">
                    {TYPE_LABEL[b.type] || b.type}
                    {b.type === "restaurant" && b.details?.guests
                      ? ` · Table for ${b.details.guests}`
                      : ""}
                    {b.type === "cinema" && b.details?.seats
                      ? ` · Seats ${b.details.seats.join(", ")}`
                      : ""}
                    {b.type === "activity" && b.details?.participants
                      ? ` · ${b.details.participants} guests`
                      : ""}
                  </p>
                  <p className="bk-list-meta">
                    {[b.date, b.time].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <span className="dash-badge dash-badge--confirmed">
                  <i className="fas fa-check" aria-hidden="true" /> Confirmed
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <aside className="bk-detail" aria-live="polite">
              <div className="bk-detail-img">
                <i className={`fas ${TYPE_ICON[selected.type] || "fa-ticket-alt"}`} aria-hidden="true" />
              </div>
              <div className="bk-detail-body">
                <span className={`trv-chip trv-chip-${selected.type}`}>{selected.type}</span>
                <h2>{selected.title}</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                  {selected.location || "Demo reservation"}
                </p>

                <dl className="bk-detail-grid">
                  <div>
                    <dt>Date</dt>
                    <dd>{selected.date || "—"}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{selected.time || "—"}</dd>
                  </div>
                  {selected.type === "restaurant" && (
                    <>
                      <div>
                        <dt>Table</dt>
                        <dd>{selected.details?.tableId || "—"}</dd>
                      </div>
                      <div>
                        <dt>Guests</dt>
                        <dd>{selected.details?.guests || "—"}</dd>
                      </div>
                    </>
                  )}
                  {selected.type === "cinema" && (
                    <>
                      <div>
                        <dt>Seats</dt>
                        <dd>{(selected.details?.seats || []).join(", ") || "—"}</dd>
                      </div>
                      <div>
                        <dt>Screen</dt>
                        <dd>{selected.details?.screen || "1"}</dd>
                      </div>
                    </>
                  )}
                  {selected.type === "activity" && (
                    <>
                      <div>
                        <dt>Language</dt>
                        <dd>{selected.details?.language || "—"}</dd>
                      </div>
                      <div>
                        <dt>Participants</dt>
                        <dd>{selected.details?.participants || "—"}</dd>
                      </div>
                    </>
                  )}
                  <div>
                    <dt>Total</dt>
                    <dd>{formatCurrencyExact(selected.totalPrice, selected.currency)}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>Confirmed</dd>
                  </div>
                </dl>

                <Link
                  to={
                    selected.type === "restaurant"
                      ? "/restaurants"
                      : selected.type === "cinema"
                        ? "/entertainment/cinemas"
                        : "/activities/tours"
                  }
                  className="trv-btn trv-btn-primary"
                  style={{ width: "100%" }}
                >
                  View / Modify
                </Link>
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
