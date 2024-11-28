/* eslint-disable react/display-name */
import { useState, forwardRef, useImperativeHandle } from "react";
import "../styles/Notifications.css";

const Notifications = forwardRef((props, ref) => {
  const [notifications, setNotifications] = useState([]); // Store bookings
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  // Function to add a booking to notifications
  const addBooking = (booking) => {
    setNotifications((prev) => [...prev, booking]);
  };

  // Expose the addBooking function to parent components
  useImperativeHandle(ref, () => ({
    addBooking,
  }));

  // Function to toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="notifications-container">
      {/* Notification Icon */}
      <div className="notification-icon" onClick={toggleModal}>
        🛎️
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </div>

      {/* Modal */}
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
        </div>
      )}
    </div>
  );
});

export default Notifications;
