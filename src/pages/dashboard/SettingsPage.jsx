import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTrip } from "../../contexts/TripContext";
import { exportTripPdf } from "../../utils/exportTripPdf";

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const { activeTrip, trips } = useTrip();

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Settings</h1>
          <p>Account, language, and trip tools.</p>
        </div>
      </div>

      <div className="trv-grid trv-grid-2">
        <div className="trv-card">
          <h3>Account</h3>
          {isAuthenticated ? (
            <>
              <p style={{ margin: "0.5rem 0", color: "var(--trv-navy)" }}>
                Signed in as <strong>{user?.fullName || user?.email || "Traveler"}</strong>
              </p>
              <Link to="/account" className="trv-btn trv-btn-secondary">
                Open account
              </Link>
            </>
          ) : (
            <>
              <p className="trv-sub">Sign in to sync profile preferences.</p>
              <Link to="/login" className="trv-btn trv-btn-primary" style={{ marginTop: "0.75rem" }}>
                Log in
              </Link>
            </>
          )}
        </div>

        <div className="trv-card">
          <h3>Active trip</h3>
          <p style={{ margin: "0.5rem 0", color: "var(--trv-navy)", fontWeight: 600 }}>
            {activeTrip?.destination || "None"}
          </p>
          <p className="trv-sub">{trips.length} trip(s) saved locally in this browser.</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            <Link to="/trips" className="trv-btn trv-btn-secondary">
              Manage trips
            </Link>
            {activeTrip && (
              <button
                type="button"
                className="trv-btn trv-btn-primary"
                onClick={() => exportTripPdf(activeTrip)}
              >
                Export trip PDF
              </button>
            )}
          </div>
        </div>

        <div className="trv-card">
          <h3>Language & profile</h3>
          <p className="trv-sub">Language preferences live in Account.</p>
          <Link to="/account" className="trv-btn trv-btn-secondary" style={{ marginTop: "0.75rem" }}>
            Account settings
          </Link>
        </div>

        <div className="trv-card">
          <h3>About simulations</h3>
          <p className="trv-sub">
            Cinema seats, restaurant tables, and activity tours are interactive demos.
            No real external reservations are created.
          </p>
        </div>
      </div>
    </div>
  );
}
