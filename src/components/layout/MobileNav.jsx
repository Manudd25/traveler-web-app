/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const links = [
  { to: "/app", label: "Home", icon: "fa-home", end: true },
  { to: "/trips", label: "Trips", icon: "fa-suitcase" },
  { to: "/itinerary", label: "Plan", icon: "fa-calendar-alt" },
  { to: "/bookings", label: "Book", icon: "fa-ticket-alt" },
  { to: "/map", label: "Map", icon: "fa-map" },
];

export default function MobileNav() {
  return (
    <nav className="trv-mobile-nav" aria-label="Mobile navigation">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className={`fas ${link.icon}`} aria-hidden="true" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
