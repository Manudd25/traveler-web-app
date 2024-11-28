/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import "../styles/Login.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [customMessage, setCustomMessage] = useState("");

  // Load registered users from localStorage when the component mounts
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    setRegisteredUsers(storedUsers);

    // Set initial message based on location state
    if (location.state?.message) {
      setCustomMessage(location.state.message);
    } else {
      setCustomMessage(isRegistering ? "Welcome!" : "Welcome Back!");
    }
  }, [location.state?.message]);

  // Update the message when switching between login and registration
  useEffect(() => {
    setCustomMessage(isRegistering ? "Welcome!" : "Welcome Back!");
  }, [isRegistering]);

  const handleLogin = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const user = registeredUsers.find(
      (user) => user.email === normalizedEmail && user.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      login();
      navigate("/");
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedFullName = fullName.trim();

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (registeredUsers.some((user) => user.email === normalizedEmail)) {
      alert("User already exists. Please log in.");
      setIsRegistering(false);
    } else {
      const newUser = {
        email: normalizedEmail,
        password,
        fullName: trimmedFullName,
        dateOfBirth,
      };
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
      alert("Registration successful! Please log in.");
      setIsRegistering(false);
    }
  };

  return (
    <div className="login-page">
      <div className="form-card">
        <h2>{customMessage}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  style={{textAlign: "left"}}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit">
            {isRegistering ? "Register" : "Log In"}
          </button>
        </form>
        <p className="toggle-text">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Log In" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
