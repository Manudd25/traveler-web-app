/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import "../styles/TourBookings.css";
import { useNotification } from "../contexts/NotificationContext";

const TourBooking = ({ tourDetails, closeModal, goBack }) => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const { addNotification } = useNotification();

  const closeModalHandler = () => {
    setConfirmationModalOpen(false);
    closeModal();
    // Remove the body lock
    document.body.classList.remove("modal-open");
  };

  const handleConfirmBooking = () => {
    setConfirmationModalOpen(true);
    setIsBookingConfirmed(true); // Hide "Go Back" and "Confirm Booking" buttons

    document.body.classList.add("modal-open");

    if (addNotification) {
      addNotification({
        name: "Booking Confirmed",
        details: `Your booking for '${tourDetails.title}' has been confirmed.\nTotal: €${tourDetails.totalPrice}.`,
        type: "success",
      });
    } else {
      console.warn("Notification context not found. Ensure NotificationProvider wraps the app.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking Confirmation", 10, 10);
    doc.text(`Tour: ${tourDetails.title}`, 10, 20);
    doc.text(`Date: ${tourDetails.date}`, 10, 30);
    doc.text(`Participants: ${tourDetails.participants}`, 10, 40);
    doc.text(`Language: ${tourDetails.language}`, 10, 50);
    doc.text(`Total Price: €${tourDetails.totalPrice}`, 10, 60);
    doc.text("Meeting Point: Underground stop: Metro B 'Colosseo'", 10, 70);
    doc.save("BookingConfirmation.pdf");
  };

  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  return (
    <>
      <div className="modal-overlay" onClick={closeModalHandler}></div>
      <div className="tour-booking-modal">
        <h2>Booking Confirmation</h2>
        <div className="tour-details">
          <p>
            <strong>Tour:</strong> {tourDetails.title}
          </p>
          <p>
            <strong>Date:</strong> {tourDetails.date}
          </p>
          <p>
            <strong>Participants:</strong> Adult x {tourDetails.participants}
          </p>
          <p>
            <strong>Language:</strong> {tourDetails.language}
          </p>
          <p>
            <strong>Total price:</strong> €{tourDetails.totalPrice}
          </p>
          <p>
            <strong>Meeting Point:</strong> Underground stop: Metro B
            "Colosseo"
          </p>
        </div>

        {!isBookingConfirmed && ( // Conditionally render "Go Back" and "Confirm Booking" buttons
          <div className="modal-actions">
            <div className="payment-method">
              <h3>Select Payment Method</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <button className="back-button" onClick={goBack}>
              Go Back
            </button>
            <button
              className="confirm-booking-button"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </button>
          </div>
        )}

        {confirmationModalOpen && (
          <div className="confirmation-modal">
            <h3>Booking Confirmed!</h3>
            <p>Your booking has been confirmed. Below are your options:</p>
            <div className="confirmation-options">
              <button
                className="download-pdf-button"
                onClick={handleDownloadPDF}
              >
                Download as PDF
              </button>
              <button
                className="show-qr-code-button"
                onClick={handleShowQRCode}
              >
                Show QR Code
              </button>
            </div>
            {showQRCode && (
              <div className="qr-code-display">
                <QRCode
                  value={`Tour: ${tourDetails.title}\nDate: ${tourDetails.date}\nParticipants: ${tourDetails.participants}\nLanguage: ${tourDetails.language}\nMeeting Point: Underground stop: Metro B 'Colosseo'`}
                  size={128}
                />
              </div>
            )}
            <button
              className="close-modal-button"
              onClick={closeModalHandler}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TourBooking;
