import { Link } from "react-router-dom";
import { useTrip } from "../../contexts/TripContext";
import { resolveTripCover } from "../../utils/tripCovers";
import {
  daysUntilTrip,
  expensesByCategory,
  formatCurrencyExact,
  formatDateRange,
  getBudgetSummary,
  getReadiness,
  groupItineraryByDay,
  tripDurationDays,
} from "../../utils/tripHelpers";

const CATEGORY_ICONS = {
  cinema: "fa-film",
  restaurant: "fa-utensils",
  activity: "fa-hiking",
};

export default function Overview() {
  const { activeTrip } = useTrip();

  if (!activeTrip) {
    return (
      <div className="trv-empty">
        <h3>No trip selected</h3>
        <p>Create a trip to start planning.</p>
        <Link to="/trips" className="trv-btn trv-btn-primary">
          My Trips
        </Link>
      </div>
    );
  }

  const countdown = daysUntilTrip(activeTrip.startDate);
  const days = tripDurationDays(activeTrip.startDate, activeTrip.endDate);
  const budget = getBudgetSummary(activeTrip);
  const readiness = getReadiness(activeTrip.checklist);
  const byCategory = expensesByCategory(activeTrip.expenses);
  const itineraryPreview = (activeTrip.itinerary || [])
    .slice()
    .sort((a, b) => a.day - b.day || (a.time || "").localeCompare(b.time || ""))
    .slice(0, 5);
  const bookingsPreview = (activeTrip.bookings || []).slice(0, 3);
  const dayCount = groupItineraryByDay(activeTrip.itinerary).length;
  const cover = resolveTripCover(activeTrip);

  const countdownLabel =
    countdown === null
      ? "Dates TBD"
      : countdown > 0
        ? "days to go"
        : countdown === 0
          ? "starts today"
          : "in progress";

  return (
    <div className="dash">
      <div className="dash-top">
        <article className="dash-hero">
          <img src={cover} alt="" aria-hidden="true" />
          <div className="dash-hero-overlay" />
          <div className="dash-hero-body">
            <span className="dash-hero-kicker">Current trip</span>
            <h1>{activeTrip.city || activeTrip.destination.split(",")[0]}</h1>
            <div className="dash-hero-meta">
              <span>{formatDateRange(activeTrip.startDate, activeTrip.endDate)}</span>
              <span>{days} days</span>
              <span>
                {activeTrip.travelers} traveler{activeTrip.travelers === 1 ? "" : "s"}
              </span>
            </div>
            <div className="dash-hero-actions">
              <Link to="/itinerary" className="trv-btn trv-btn-primary">
                View itinerary <i className="fas fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>

        <div className="dash-side-stack">
          <div className="dash-stat">
            <h3>Countdown</h3>
            <div className="dash-stat-value">{countdown ?? "—"}</div>
            <p className="dash-stat-sub">{countdownLabel}</p>
          </div>
          <div className="dash-stat">
            <h3>Weather</h3>
            <div className="dash-weather-icon" aria-hidden="true">
              <i className="fas fa-sun" />
            </div>
            <div className="dash-stat-value" style={{ fontSize: "1.5rem" }}>
              24°
            </div>
            <p className="dash-stat-sub">Sunny · H 27° / L 18°</p>
          </div>
        </div>
      </div>

      <div className="dash-status-grid">
        <div className="dash-status-card">
          <h3>Flight status</h3>
          <div className="value">{activeTrip.flightStatus || "Not set"}</div>
          {/confirm/i.test(activeTrip.flightStatus || "") && (
            <div className="dash-status-ok">
              <i className="fas fa-check-circle" aria-hidden="true" /> On track
            </div>
          )}
        </div>
        <div className="dash-status-card">
          <h3>Accommodation</h3>
          <div className="value">{activeTrip.accommodation || "Not booked"}</div>
          <p className="hint">Primary stay</p>
        </div>
        <div className="dash-status-card">
          <h3>Reservations</h3>
          <div className="value">{activeTrip.bookings?.length || 0}</div>
          <p className="hint">Confirmed demos</p>
        </div>
        <div className="dash-status-card">
          <h3>Travel readiness</h3>
          <div className="dash-ring" style={{ "--p": readiness }}>
            <span>{readiness}%</span>
          </div>
        </div>
      </div>

      <div className="dash-mid">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>Trip budget</h2>
            <Link to="/budget">Manage</Link>
          </div>
          <div className="dash-budget-amount">
            {formatCurrencyExact(budget.spent, budget.currency)}{" "}
            <span>/ {formatCurrencyExact(budget.total, budget.currency)}</span>
          </div>
          <div className="trv-progress" style={{ margin: "0.75rem 0 1rem" }}>
            <span
              style={{
                width: `${budget.total ? Math.min(100, Math.round((budget.spent / budget.total) * 100)) : 0}%`,
              }}
            />
          </div>
          {Object.entries(byCategory)
            .slice(0, 5)
            .map(([cat, amount]) => (
              <div className="dash-cat-row" key={cat}>
                <span style={{ textTransform: "capitalize" }}>{cat}</span>
                <strong>{formatCurrencyExact(amount, budget.currency)}</strong>
              </div>
            ))}
          {Object.keys(byCategory).length === 0 && (
            <p className="trv-sub">No expenses recorded yet.</p>
          )}
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>Itinerary overview</h2>
            <Link to="/itinerary">View all</Link>
          </div>
          {itineraryPreview.length === 0 ? (
            <p className="trv-sub">Add your first itinerary item.</p>
          ) : (
            itineraryPreview.map((item) => (
              <div className="dash-itin-row" key={item.id}>
                <span className="dash-itin-time">{item.time || "--:--"}</span>
                <div>
                  <div className="dash-itin-title">{item.title}</div>
                  {item.location && <div className="dash-itin-loc">{item.location}</div>}
                </div>
                <span
                  className={`dash-badge dash-badge--${
                    item.bookingStatus === "confirmed" ? "confirmed" : "planned"
                  }`}
                >
                  {item.bookingStatus === "confirmed" ? "Confirmed" : "Suggested"}
                </span>
              </div>
            ))
          )}
          <p className="trv-sub" style={{ marginTop: "0.75rem" }}>
            {dayCount} day{dayCount === 1 ? "" : "s"} planned
          </p>
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>Upcoming bookings</h2>
            <Link to="/bookings">View all</Link>
          </div>
          {bookingsPreview.length === 0 ? (
            <p className="trv-sub">No bookings yet.</p>
          ) : (
            bookingsPreview.map((b) => (
              <Link key={b.id} to="/bookings" className="dash-book-card">
                <div className="dash-book-thumb">
                  <i className={`fas ${CATEGORY_ICONS[b.type] || "fa-ticket-alt"}`} aria-hidden="true" />
                </div>
                <div>
                  <div className="dash-book-title">{b.title}</div>
                  <div className="dash-book-meta">
                    {[b.type, b.date, b.time].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </Link>
            ))
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
            <Link to="/restaurants" className="trv-btn trv-btn-secondary" style={{ fontSize: "0.8rem" }}>
              Restaurant
            </Link>
            <Link to="/entertainment/cinemas" className="trv-btn trv-btn-secondary" style={{ fontSize: "0.8rem" }}>
              Cinema
            </Link>
            <Link to="/activities/tours" className="trv-btn trv-btn-secondary" style={{ fontSize: "0.8rem" }}>
              Tour
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
