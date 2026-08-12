/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useTrip } from "../../contexts/TripContext";

export default function TopBar({ onMenuClick }) {
  const { activeTrip } = useTrip();
  const { notifications, clearNotifications } = useNotification();
  const { isAuthenticated, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="trv-topbar">
      <div className="trv-topbar-left">
        <button
          type="button"
          className="trv-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <i className="fas fa-bars" aria-hidden="true" />
        </button>
        {activeTrip && (
          <div className="trv-trip-chip" title="Active trip">
            <i className="fas fa-map-marker-alt" aria-hidden="true" />
            <span>{activeTrip.destination}</span>
          </div>
        )}
      </div>

      <div className="trv-topbar-actions">
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="trv-icon-btn"
            aria-label="Notifications"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <i className="fas fa-bell" aria-hidden="true" />
            {notifications.length > 0 && (
              <span className="trv-badge">{notifications.length}</span>
            )}
          </button>
          {notifOpen && (
            <div className="trv-notif-panel" role="dialog" aria-label="Notifications">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong>Notifications</strong>
                <button type="button" className="trv-btn trv-btn-ghost" onClick={clearNotifications}>
                  Clear
                </button>
              </div>
              {notifications.length === 0 ? (
                <p style={{ margin: 0, color: "var(--trv-muted)", fontSize: "0.85rem" }}>
                  No notifications yet.
                </p>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className="trv-notif-item">
                    <strong>{n.title || n.name}</strong>
                    <span>{n.message || n.details}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Link to="/favorites" className="trv-icon-btn" aria-label="Favorites">
          <i className="fas fa-heart" aria-hidden="true" />
        </Link>

        <button
          type="button"
          className="trv-icon-btn"
          aria-label={isAuthenticated ? "Account" : "Log in"}
          onClick={() => navigate(isAuthenticated ? "/account" : "/login")}
        >
          <i className="fas fa-user" aria-hidden="true" />
        </button>

        {isAuthenticated && (
          <button
            type="button"
            className="trv-btn trv-btn-secondary"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
}
