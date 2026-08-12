/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import CinemaSeatMap from "./CinemaSeatMap";
import BookingSummary from "./BookingSummary";
import DemoDisclaimer from "../components/bookings/DemoDisclaimer";
import "../styles/CinemaBooking.css";
import QRCode from "react-qr-code";
import { jsPDF } from "jspdf";
import { useNotification } from "../contexts/NotificationContext";
import { useTrip } from "../contexts/TripContext";
import { BOOKING_TYPES } from "../data/constants";

function CinemaBooking() {
  const { addNotification } = useNotification();
  const { activeTrip, confirmBooking } = useTrip();
  const { bookingId } = useParams();
  const location = useLocation();
  const cinemaName = location.state?.cinemaName || "Starwalk Cinema";
  const movieTitle = location.state?.movieTitle || "Unknown Movie";

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTime, setShowTime] = useState(null);
  const [showDate, setShowDate] = useState(
    activeTrip?.startDate || new Date().toISOString().slice(0, 10)
  );
  const [ticketCounts, setTicketCounts] = useState({
    adult: 0,
    child: 0,
    family: 0,
    student: 0,
  });
  const [finalTotal, setFinalTotal] = useState(0);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [reservedSeats, setReservedSeats] = useState([]);

  const ticketPrices = {
    adult: 8.0,
    child: 6.0,
    family: 20.0,
    student: 7.0,
  };

  const handleSeatSelection = (seat, allSelected) => {
    if (Array.isArray(allSelected)) {
      setSelectedSeats(allSelected);
    } else {
      setSelectedSeats((prev) =>
        prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
      );
    }
  };

  const handleTotalChange = (newTotal, tickets) => {
    setFinalTotal(newTotal);
    if (tickets) setTicketCounts(tickets);
  };

  const finalizeBooking = () => {
    if (confirmed) return;
    setReservedSeats((prev) => [...prev, ...selectedSeats]);

    if (activeTrip) {
      confirmBooking(activeTrip.id, {
        type: BOOKING_TYPES.CINEMA,
        title: `${movieTitle} @ ${cinemaName}`,
        date: showDate,
        time: showTime || "19:00",
        totalPrice: finalTotal,
        location: cinemaName,
        notes: `Seats ${selectedSeats.join(", ")}`,
        details: {
          movieTitle,
          cinemaName,
          seats: selectedSeats,
          showTime,
          screen: "1",
          tickets: ticketCounts,
        },
      });
    }

    addNotification({
      title: "Booking Confirmed",
      message: `Demo booking for “${movieTitle}” · seats ${selectedSeats.join(", ")} · €${finalTotal.toFixed(2)}`,
      type: "success",
    });
    setConfirmed(true);
  };

  const handleNext = () => {
    if (currentStep === 1 && (!selectedSeats.length || !showTime)) {
      addNotification({
        title: "Almost there",
        message: "Select at least one seat and a showtime.",
        type: "warning",
      });
      return;
    }
    if (currentStep === 3) {
      finalizeBooking();
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Cinema Booking Confirmation (Demo)", 10, 10);
    doc.text(`Movie: ${movieTitle}`, 10, 30);
    doc.text(`Cinema: ${cinemaName}`, 10, 40);
    doc.text(`Booking ID: ${bookingId}`, 10, 50);
    doc.text(`Seats: ${selectedSeats.join(", ") || "None"}`, 10, 60);
    doc.text(`Date: ${showDate}`, 10, 70);
    doc.text(`Show Time: ${showTime || "Not Selected"}`, 10, 80);
    doc.text(`Total: €${finalTotal.toFixed(2)}`, 10, 90);
    doc.text("Demo booking — no real reservation will be made.", 10, 105);
    doc.save("cinema_booking_confirmation.pdf");
  };

  return (
    <div className="cinema-booking-container">
      <header className="cinema-booking-header">
        <h2>{movieTitle}</h2>
        <p>{cinemaName} · Screen 1</p>
      </header>

      <div className="steps">
        <div className={`step ${currentStep === 1 ? "active" : ""}`}>1. Select Seats</div>
        <div className={`step ${currentStep === 2 ? "active" : ""}`}>2. Tickets</div>
        <div className={`step ${currentStep === 3 ? "active" : ""}`}>3. Summary & Payment</div>
        <div className={`step ${currentStep === 4 ? "active" : ""}`}>4. Confirmation</div>
      </div>

      {currentStep === 1 && (
        <div className="step-content">
          <CinemaSeatMap
            onSeatSelect={handleSeatSelection}
            reservedSeats={reservedSeats}
          />
          <div className="seat-selection">
            <h3>Selected Seats</h3>
            <div className="selected-seats">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </div>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
              Est. seat total preview updates with tickets on the next step.
            </p>
          </div>

          <div className="showtime-selection">
            <h3>Date</h3>
            <input
              type="date"
              value={showDate}
              onChange={(e) => setShowDate(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: 6, border: "1px solid #ccc" }}
            />
            <h3 style={{ marginTop: "1rem" }}>Select Show Time</h3>
            <div className="showtime-options">
              {["13:00", "16:00", "19:30"].map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`showtime-button ${showTime === time ? "selected" : ""}`}
                  onClick={() => setShowTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="step-content">
          <h3>Tickets & pricing</h3>
          <p style={{ marginBottom: "0.75rem" }}>
            Seats: <strong>{selectedSeats.join(", ") || "None"}</strong>
          </p>
          <BookingSummary
            ticketCounts={ticketCounts}
            ticketPrices={ticketPrices}
            onTotalChange={handleTotalChange}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-content">
          <h4>Payment Method (demo)</h4>
          <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
            Total due: <strong>€{finalTotal.toFixed(2)}</strong> · {selectedSeats.length} seat(s) ·{" "}
            {showDate} {showTime}
          </p>
          <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="cardholder-name">Cardholder Name</label>
              <input type="text" id="cardholder-name" name="cardholderName" required />
            </div>
            <div className="form-group">
              <label htmlFor="card-number">Card Number</label>
              <input type="text" id="card-number" name="cardNumber" required maxLength="16" />
            </div>
            <div className="form-group">
              <label htmlFor="expiry-date">Expiry Date</label>
              <input type="text" id="expiry-date" name="expiryDate" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input type="password" id="cvv" name="cvv" required maxLength="3" />
            </div>
          </form>
          <DemoDisclaimer />
        </div>
      )}

      {currentStep === 4 && (
        <div className="step-content">
          <h3 style={{ textAlign: "center" }}>Confirmation</h3>
          <p style={{ textAlign: "center" }}>
            Your demo cinema booking is confirmed
            {activeTrip ? ` and added to ${activeTrip.destination}` : ""}.
          </p>
          <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
            {movieTitle} · Seats {selectedSeats.join(", ")} · {showDate} {showTime} · €
            {finalTotal.toFixed(2)}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={downloadPDF} className="download-ticket">
              Download Ticket (PDF)
            </button>
            <button type="button" onClick={() => setQrModalOpen(true)} className="show-qr">
              Show QR Code
            </button>
            <Link to="/bookings" className="trv-btn trv-btn-primary">
              View in Bookings
            </Link>
            <Link to="/itinerary" className="trv-btn trv-btn-secondary">
              Open Itinerary
            </Link>
          </div>

          {qrModalOpen && (
            <>
              <div className="modal-overlay" onClick={() => setQrModalOpen(false)} />
              <div className="qr-modal">
                <div className="qr-code-container">
                  <QRCode
                    value={`DEMO Booking ID: ${bookingId}, Seats: ${selectedSeats.join(", ")}`}
                  />
                  <button type="button" onClick={() => setQrModalOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="step-navigation">
        {currentStep > 1 && currentStep < 4 && (
          <button type="button" onClick={handleBack}>
            Back
          </button>
        )}
        {currentStep < 4 && (
          <button type="button" onClick={handleNext}>
            {currentStep === 3 ? "Confirm booking" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}

export default CinemaBooking;
