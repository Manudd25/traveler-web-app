/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "../styles/BookingSummary.css";

export default function BookingSummary({ onTotalChange, ticketPrices }) {
  const [tickets, setTickets] = useState({
    adult: 0,
    child: 0,
    student: 0,
    family: 0,
  });

  const prices = ticketPrices || {
    adult: 8.0,
    child: 6.0,
    student: 7.0,
    family: 20.0,
  };

  const total = Object.entries(tickets).reduce(
    (sum, [type, count]) => sum + count * (prices[type] || 0),
    0
  );

  const handleInputChange = (type, value) => {
    setTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, Number(value)),
    }));
  };

  const labels = {
    adult: "Adult",
    child: "Child (under 12)",
    student: "Student",
    family: "Family Pack",
  };

  useEffect(() => {
    if (onTotalChange) onTotalChange(total, tickets);
    // Parent callback is recreated each render; depend on totals only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, tickets]);

  return (
    <div className="booking-summary">
      <div className="ticket-summary">
        {Object.entries(tickets).map(([type, count]) => (
          <div className="ticket-summary-row" key={type}>
            <span>
              {labels[type]} · €{(prices[type] || 0).toFixed(2)}
            </span>
            <input
              type="number"
              min="0"
              aria-label={`${labels[type]} tickets`}
              value={count}
              onChange={(e) => handleInputChange(type, e.target.value)}
            />
            <span>€{(count * (prices[type] || 0)).toFixed(2)}</span>
          </div>
        ))}

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
