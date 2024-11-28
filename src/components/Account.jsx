import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Account.css";

const Account = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated} = useAuth();

  const [activeSection, setActiveSection] = useState("bookingHistory");
  const [userDetails, setUserDetails] = useState(() => {
    const currentUser = localStorage.getItem("currentUser");
    const parsedUser = currentUser ? JSON.parse(currentUser) : null;

    return parsedUser
      ? { ...parsedUser, paymentMethods: parsedUser.paymentMethods || [] }
      : { fullName: "", email: "", dateOfBirth: "", paymentMethods: [] };
  });

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      const isNewUser = localStorage.getItem("isNewUser");
      const welcomeMessage = isNewUser ? "Welcome!" : "Welcome back!";
      if (isNewUser) localStorage.removeItem("isNewUser");
      navigate("/login", { state: { message: t(welcomeMessage) } });
    }
  }, [isAuthenticated, navigate, t]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedDetails = { ...userDetails, [name]: value };
    setUserDetails(updatedDetails);
    localStorage.setItem("currentUser", JSON.stringify(updatedDetails));
  };

  const addPaymentMethod = (e) => {
    e.preventDefault();
    const updatedMethods = [
      ...userDetails.paymentMethods,
      {
        ...newPaymentMethod,
        cardNumber: newPaymentMethod.cardNumber.slice(-4), // Store only the last 4 digits
        cvv: "***", // Mask CVV
      },
    ];
    const updatedDetails = { ...userDetails, paymentMethods: updatedMethods };
    setUserDetails(updatedDetails);
    localStorage.setItem("currentUser", JSON.stringify(updatedDetails));
    setNewPaymentMethod({ cardNumber: "", expiryDate: "", cvv: "" }); // Clear form
  };

  const removePaymentMethod = (index) => {
    const updatedMethods = userDetails.paymentMethods.filter((_, i) => i !== index);
    const updatedDetails = { ...userDetails, paymentMethods: updatedMethods };
    setUserDetails(updatedDetails);
    localStorage.setItem("currentUser", JSON.stringify(updatedDetails));
  };

  const renderSection = () => {
    switch (activeSection) {
      case "bookingHistory":
        return (
          <div>
            <h2>{t("bookingHistory")}</h2>
            <ul className="history-list">
              <li>🍴 Dinner at La Piazza - 21st Nov, 2024</li>
              <li>⚽ Soccer Match Tickets - 18th Nov, 2024</li>
              <li>🚌 Tour of Rome - 15th Nov, 2024</li>
              <li>🎭 Theater Night - 10th Nov, 2024</li>
            </ul>
          </div>
        );
      case "personalDetails":
        return (
          <div>
            <h2>{t("personalDetails")}</h2>
            <form>
              <div className="form-group">
                <label>{t("fullName")}</label>
                <input
                  type="text"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>{t("email")}</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dateOfBirth")}</label>
                <input
                  style={{ textAlign: "left" }}
                  type="date"
                  name="dateOfBirth"
                  value={userDetails.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn-submit">
                {t("saveChanges")}
              </button>
            </form>
          </div>
        );
      case "paymentDetails":
        return (
          <div>
            <h2>{t("paymentDetails")}</h2>
            <ul className="payment-list">
              {userDetails.paymentMethods.map((method, index) => (
                <li key={index} className="payment-method">
                  <span>Card Ending in: **** {method.cardNumber}</span>
                  <span>Expiry Date: {method.expiryDate}</span>
                  <span>CVV: {method.cvv}</span>
                  <button
                    className="remove-payment-button"
                    onClick={() => removePaymentMethod(index)}
                  >
                    {t("remove")}
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={addPaymentMethod}>
              <div className="form-group">
                <label>{t("cardNumber")}</label>
                <input
                  type="text"
                  placeholder="Enter card number"
                  value={newPaymentMethod.cardNumber}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      cardNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("expiryDate")}</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={newPaymentMethod.expiryDate}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiryDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("cvv")}</label>
                <input
                  type="password"
                  placeholder="Enter CVV"
                  value={newPaymentMethod.cvv}
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      cvv: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                {t("addPaymentMethod")}
              </button>
            </form>
          </div>
        );
      case "changeLanguage":
        return (
          <div>
            <h2>{t("changeLanguage")}</h2>
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="it">Italian</option>
              <option value="de">German</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="account-page">
      <div className="sidebar">
        <ul>
          <li
            onClick={() => setActiveSection("bookingHistory")}
            className={activeSection === "bookingHistory" ? "active" : ""}
          >
            {t("bookingHistory")}
          </li>
          <li
            onClick={() => setActiveSection("personalDetails")}
            className={activeSection === "personalDetails" ? "active" : ""}
          >
            {t("personalDetails")}
          </li>
          <li
            onClick={() => setActiveSection("paymentDetails")}
            className={activeSection === "paymentDetails" ? "active" : ""}
          >
            {t("paymentDetails")}
          </li>
          <li
            onClick={() => setActiveSection("changeLanguage")}
            className={activeSection === "changeLanguage" ? "active" : ""}
          >
            {t("changeLanguage")}
          </li>
        </ul>
      </div>
      <div className="content">{renderSection()}</div>
    </div>
  );
};

export default Account;
