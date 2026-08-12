/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const normalized = {
      title: notification.title || notification.name || "Notification",
      message: notification.message || notification.details || "",
      type: notification.type || "info",
    };
    setNotifications((prev) => [...prev, normalized]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 8000);
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearNotifications }}
    >
      {children}
      <div className="notifications-container" aria-live="polite">
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
