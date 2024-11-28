/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import CinemaSeatMap from "./CinemaSeatMap";
import BookingSummary from "./BookingSummary";
import "../styles/CinemaBooking.css";
import QRCode from "react-qr-code";
import { jsPDF } from "jspdf";
import { useNotification } from "../contexts/NotificationContext";

function CinemaBooking() {
  const { addNotification } = useNotification(); 
  const { bookingId } = useParams();
  const location = useLocation();
  const cinemaName = location.state?.cinemaName || "Starwalk Cinema";
  const movieTitle = location.state?.movieTitle || "Unknown Movie";

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTime, setShowTime] = useState(null);
  const [ticketCounts, setTicketCounts] = useState({
    adults: 0,
    kids: 0,
    family: 0,
    students: 0,
  });
  const [finalTotal, setFinalTotal] = useState(0);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const ticketPrices = {
    adults: 8.0,
    kids: 6.0,
    family: 20.0,
    students: 7.0,
  };

  const handleNext = () => {
    if (currentStep === 3) {
    
      addNotification({
        name: "Booking Confirmed",
        details: `Your booking for '${movieTitle}' has been confirmed.\nTotal: €${finalTotal.toFixed(
          2
        )}.`,
        type: "success",
      });
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleTotalChange = (newTotal) => {
    setFinalTotal(newTotal);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Confirmation", 10, 10);
    doc.text(`Movie: ${movieTitle}`, 10, 30);
    doc.text(`Booking ID: ${bookingId}`, 10, 40);
    doc.text(`Seats: ${selectedSeats.join(", ") || "None"}`, 10, 50);
    doc.text(`Show Time: ${showTime || "Not Selected"}`, 10, 60);

    let y = 80;
    Object.entries(ticketCounts).forEach(([type, count]) => {
      if (count > 0) {
        doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`, 10, y);
        y += 10;
      }
    });

    doc.text(`Total: €${finalTotal.toFixed(2)}`, 10, y + 10);
    doc.save("booking_confirmation.pdf");
  };

  return (
    <div className="cinema-booking-container">
      <h2>Booking Details</h2>

      <div className="steps">
        <div className={`step ${currentStep === 1 ? "active" : ""}`}>1. Select Seats</div>
        <div className={`step ${currentStep === 2 ? "active" : ""}`}>2. Tickets</div>
        <div className={`step ${currentStep === 3 ? "active" : ""}`}>3. Summary & Payment</div>
        <div className={`step ${currentStep === 4 ? "active" : ""}`}>4. Confirmation</div>
      </div>

      {currentStep === 1 && (
        <div className="step-content">
          <CinemaSeatMap onSeatSelect={handleSeatSelection} />
          <div className="seat-selection">
            <h3>Selected Seats</h3>
            <div className="selected-seats">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </div>
          </div>

          <div className="showtime-selection">
            <h3>Select Show Time</h3>
            <div className="showtime-options">
              {["1:00 PM", "4:00 PM", "7:30 PM"].map((time) => (
                <button
                  key={time}
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
          <h3>Booking Summary</h3>
          <BookingSummary
            ticketCounts={ticketCounts}
            ticketPrices={ticketPrices}
            onTotalChange={handleTotalChange}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-content">
          <h4>Payment Method</h4>
          <form className="payment-form">
            <div className="form-group">
              <label htmlFor="cardholder-name">Cardholder Name:</label>
              <input type="text" id="cardholder-name" name="cardholderName" required />
            </div>
            <div className="form-group">
              <label htmlFor="card-number">Card Number:</label>
              <input type="text" id="card-number" name="cardNumber" required maxLength="16" />
            </div>
            <div className="form-group">
              <label htmlFor="expiry-date">Expiry Date:</label>
              <input type="text" id="expiry-date" name="expiryDate" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input type="password" id="cvv" name="cvv" required maxLength="3" />
            </div>
            <div className="form-group">
              <label htmlFor="billing-address">Billing Address:</label>
              <input type="text" id="billing-address" name="billingAddress" required />
            </div>
          </form>
        </div>
      )}

      {currentStep === 4 && (
        <div className="step-content">
          <h3 style={{ textAlign: "center" }}>Confirmation</h3>
          <p style={{ textAlign: "center" }}>Your booking is confirmed!</p>
          <button onClick={downloadPDF} className="download-ticket">
            Download Ticket (PDF)
          </button>
          <button onClick={() => setQrModalOpen(true)} className="show-qr">
            Show QR Code
          </button>

          {qrModalOpen && (
            <>
              <div className="modal-overlay" onClick={() => setQrModalOpen(false)}></div>
              <div className="qr-modal">
                <div className="qr-code-container">
                  <QRCode
                    value={`Booking ID: ${bookingId}, Seats: ${selectedSeats.join(", ")}`}
                  />
                  <button onClick={() => setQrModalOpen(false)}>Close</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="step-navigation">
        {currentStep > 1 && <button onClick={handleBack}>Back</button>}
        {currentStep < 4 && <button onClick={handleNext}>Next</button>}
      </div>
    </div>
  );
}

export default CinemaBooking;
