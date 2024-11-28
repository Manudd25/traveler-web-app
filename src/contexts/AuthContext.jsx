/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    const authTime = localStorage.getItem("authTime");
    if (isAuth && authTime) {
      const isValid = Date.now() - parseInt(authTime, 10) < 24 * 60 * 60 * 1000; // 24 hours expiration
      return isValid;
    }
    return false;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    console.log("Logging in...");
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authTime", Date.now());
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("Logging out...");
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTime");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const authTime = localStorage.getItem("authTime");
    if (authTime && Date.now() - parseInt(authTime, 10) >= 24 * 60 * 60 * 1000) {
      logout(); // Auto logout expired sessions
    }
  }, []);

  console.log("AuthContext isAuthenticated:", isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
