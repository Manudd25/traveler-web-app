/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "../styles/BookingSummary.css";

export default function BookingSummary({ onTotalChange }) {
  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    student: 0,
    family: 0,
  });

  const prices = {
    adult: 8.0,
    child: 6.0,
    student: 7.0,
    family: 20.0,
  };

  // Calculate total dynamically
  const total = Object.entries(tickets).reduce(
    (sum, [type, count]) => sum + count * prices[type],
    0
  );

  const handleInputChange = (type, value) => {
    setTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, Number(value)), // Ensure value is non-negative
    }));
  };

  const labels = {
    adult: "Adult",
    child: "Child (under 12)", // Specify the label here
    student: "Student",
    family: "Family Pack",
  };

  // Notify parent component of total price change
  useEffect(() => {
    if (onTotalChange) {
      onTotalChange(total); // Call the callback to pass the total price to the parent component
    }
  }, [total, onTotalChange]);

  return (
    <div className="booking-summary">
      <div className="ticket-summary">
        {Object.entries(tickets).map(([type, count]) => (
          <div className="ticket-summary-row" key={type}>
            <span>{labels[type]}</span>
            <input
              type="number"
              min="0"
              value={count}
              onChange={(e) => handleInputChange(type, e.target.value)}
            />
            <span>€{(count * prices[type]).toFixed(2)}</span>
          </div>
        ))}

        {/* Total */}
        <div className="ticket-summary-total">
          <span>
            <strong>Total:</strong>
          </span>
          <span>
            <strong>€{total.toFixed(2)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
