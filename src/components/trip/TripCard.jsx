/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { resolveTripCover } from "../../utils/tripCovers";
import {
  formatCurrency,
  formatDateRange,
  getReadiness,
  getTripStatus,
  tripDurationDays,
} from "../../utils/tripHelpers";

export default function TripCard({ trip, active, onSelect }) {
  const status = getTripStatus(trip);
  const readiness = getReadiness(trip.checklist);
  const days = tripDurationDays(trip.startDate, trip.endDate);
  const cover = resolveTripCover(trip);

  return (
    <article
      className="trv-card"
      style={{
        padding: 0,
        overflow: "hidden",
        outline: active ? "2px solid var(--trv-cyan)" : undefined,
        cursor: "pointer",
      }}
      onClick={() => onSelect?.(trip.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(trip.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${trip.destination}, ${status}`}
    >
      <div
        style={{
          height: 120,
          backgroundImage: `linear-gradient(135deg, rgba(13,27,42,0.35), rgba(13,27,42,0.55)), url(${cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
          <h3 style={{ margin: 0, color: "var(--trv-navy)", fontFamily: "var(--trv-display)", fontSize: "1.15rem" }}>
            {trip.destination}
          </h3>
          <span className="trv-chip">{status}</span>
        </div>
        <p style={{ margin: "0.4rem 0", color: "var(--trv-muted)", fontSize: "0.88rem" }}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem" }}>
          {days} days · {trip.travelers} travelers · Budget {formatCurrency(trip.budgetTotal, trip.currency)}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="trv-progress" style={{ flex: 1 }}>
            <span style={{ width: `${readiness}%` }} />
          </div>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--trv-navy)" }}>
            {readiness}%
          </span>
        </div>
        <div style={{ marginTop: "0.85rem" }}>
          <Link
            to="/app"
            className="trv-btn trv-btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(trip.id);
            }}
          >
            Open trip
          </Link>
        </div>
      </div>
    </article>
  );
}
