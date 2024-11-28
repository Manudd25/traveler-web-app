import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext

const Navbar = () => {
  const { notifications, clearNotifications } = useNotification();
  const { logout, isAuthenticated } = useAuth(); // Use isAuthenticated from AuthContext
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const toggleAccountMenu = () => {
    if (isAuthenticated) {
      setIsAccountMenuOpen((prev) => !prev);
    } else {
      navigate("/login"); // Redirect to login page if not logged in
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    alert("You logged out successfully!");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          🌍 Hello, Traveler
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li className="dropdown">
            <Link to="/restaurants">Restaurants</Link>
            <ul className="dropdown-menu">
              <li><Link to="/restaurants/bars">Bars</Link></li>
              <li><Link to="/restaurants/pubs">Pubs</Link></li>
            </ul>
          </li>
          <li className="dropdown">
            <Link to="/activities">Activities</Link>
            <ul className="dropdown-menu">
              <li><Link to="/activities/sports">Sports</Link></li>
              <li><Link to="/activities/tours">Tours</Link></li>
              <li><Link to="/activities/excursions">Excursions</Link></li>
            </ul>
          </li>
          <li className="dropdown">
            <Link to="/entertainment">Entertainment</Link>
            <ul className="dropdown-menu">
              <li><Link to="/entertainment/cinemas">Cinemas</Link></li>
              <li><Link to="/entertainment/clubs">Clubs</Link></li>
              <li><Link to="/entertainment/theaters">Theaters</Link></li>
              <li><Link to="/entertainment/concerts">Concerts</Link></li>
            </ul>
          </li>
        </ul>

        {/* Icons Section */}
        <div className="nav-icons">
          {/* Notifications */}
          <div className="notification-container">
            <i
              className="fas fa-bell"
              title="Notifications"
              onClick={toggleModal}
            ></i>
            {notifications.length > 0 && (
              <span
                className="notification-badge"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal();
                }}
              >
                {notifications.length}
              </span>
            )}

            {isModalOpen && (
              <div className="notification-modal">
                <h4>Recent Bookings</h4>
                {notifications.length === 0 ? (
                  <p>No bookings yet.</p>
                ) : (
                  <ul>
                    {notifications.map((notification, index) => (
                      <li key={index}>
                        <strong>{notification.name}</strong>
                        <p>{notification.details}</p>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => {
                    clearNotifications();
                    toggleModal();
                  }}
                >
                  Clear Notifications
                </button>
              </div>
            )}
          </div>

          {/* Favorites */}
          <Link to="/favorites" title="Favorites">
            <i className="fas fa-heart"></i>
          </Link>

          {/* Account */}
          <div className="account-container">
            <i
              className="fas fa-user-circle"
              title="Account"
              onClick={toggleAccountMenu}
            ></i>
            {isAuthenticated && isAccountMenuOpen && ( // Show modal only if logged in
              <div className="account-modal">
                <Link to="/account">Account</Link>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;