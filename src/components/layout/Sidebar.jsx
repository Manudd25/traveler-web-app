/* eslint-disable react/prop-types */
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const mainLinks = [
  { to: "/app", label: "Overview", icon: "fa-th-large", end: true },
  { to: "/trips", label: "My Trips", icon: "fa-suitcase" },
  { to: "/itinerary", label: "Itinerary", icon: "fa-calendar-alt" },
  { to: "/map", label: "Map", icon: "fa-map-marked-alt" },
  { to: "/bookings", label: "Bookings", icon: "fa-ticket-alt" },
  { to: "/budget", label: "Budget", icon: "fa-wallet" },
  { to: "/documents", label: "Documents", icon: "fa-folder-open" },
  { to: "/checklist", label: "Travel Checklist", icon: "fa-tasks" },
];

const discoverLinks = [
  { to: "/discover", label: "Discover", icon: "fa-compass" },
  { to: "/restaurants", label: "Restaurants", icon: "fa-utensils" },
  { to: "/activities/tours", label: "Tours", icon: "fa-hiking" },
  { to: "/entertainment/cinemas", label: "Cinemas", icon: "fa-film" },
];

export default function Sidebar({ open, onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const displayName = user?.fullName || user?.name || "Traveler";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className={`trv-sidebar ${open ? "open" : ""}`} aria-label="Main navigation">
      <div className="trv-brand">
        <Link to="/" className="trv-brand-row" onClick={onNavigate} aria-label="Back to Traveler landing page">
          <span className="trv-brand-mark" aria-hidden="true">
            <i className="fas fa-plane" />
          </span>
          <div>
            <span className="trv-brand-name">Traveler</span>
            <span className="trv-brand-tag">Trip Command Center</span>
          </div>
        </Link>
      </div>

      <nav className="trv-nav">
        {mainLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `trv-nav-link ${isActive ? "active" : ""}`}
            onClick={onNavigate}
          >
            <i className={`fas ${link.icon} trv-nav-icon`} aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}

        <div className="trv-nav-section">Explore</div>
        {discoverLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `trv-nav-link ${isActive ? "active" : ""}`}
            onClick={onNavigate}
          >
            <i className={`fas ${link.icon} trv-nav-icon`} aria-hidden="true" />
            {link.label}
          </NavLink>
        ))}

        <div className="trv-nav-section">Account</div>
        <NavLink
          to="/settings"
          className={({ isActive }) => `trv-nav-link ${isActive ? "active" : ""}`}
          onClick={onNavigate}
        >
          <i className="fas fa-cog trv-nav-icon" aria-hidden="true" />
          Settings
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => `trv-nav-link ${isActive ? "active" : ""}`}
          onClick={onNavigate}
        >
          <i className="fas fa-heart trv-nav-icon" aria-hidden="true" />
          Favorites
        </NavLink>
      </nav>

      <div className="trv-sidebar-profile">
        <Link to={isAuthenticated ? "/account" : "/login"} className="trv-profile-link" onClick={onNavigate}>
          <span className="trv-avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="trv-profile-text">
            <strong>{isAuthenticated ? displayName.split(" ")[0] : "Guest"}</strong>
            <small>{isAuthenticated ? "Premium" : "Sign in"}</small>
          </span>
        </Link>
      </div>
    </aside>
  );
}
