/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

// Create context
const NotificationContext = createContext();

// Custom hook to access the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

// Provider to wrap the app
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a notification
  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 10000);
  };

  // Function to clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearNotifications }}
    >
      {children}
      {/* Render notifications */}
      <div className="notifications-container">
        {notifications.map((notification, index) => (
          <div key={index} className={`notification ${notification.type}`}>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
