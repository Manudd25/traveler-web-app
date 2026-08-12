/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import "../styles/TourBookings.css";
import { useNotification } from "../contexts/NotificationContext";
import { useTrip } from "../contexts/TripContext";
import DemoDisclaimer from "../components/bookings/DemoDisclaimer";
import { BOOKING_TYPES } from "../data/constants";

const TourBooking = ({ tourDetails, closeModal, goBack }) => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const { addNotification } = useNotification();
  const { activeTrip, confirmBooking } = useTrip();

  const closeModalHandler = () => {
    setConfirmationModalOpen(false);
    closeModal();
    document.body.classList.remove("modal-open");
  };

  const handleConfirmBooking = () => {
    if (!isBookingConfirmed && activeTrip) {
      confirmBooking(activeTrip.id, {
        type: BOOKING_TYPES.ACTIVITY,
        title: tourDetails.title,
        date: tourDetails.date,
        time: tourDetails.time,
        totalPrice: Number(tourDetails.totalPrice) || 0,
        location: tourDetails.location || tourDetails.meetingPoint,
        notes: `Language: ${tourDetails.language}`,
        coordinates: tourDetails.coordinates || null,
        details: {
          language: tourDetails.language,
          participants: tourDetails.participants,
          duration: tourDetails.duration,
          meetingPoint: tourDetails.meetingPoint,
          pricePerPerson: tourDetails.pricePerPerson,
          time: tourDetails.time,
        },
      });
    }

    setConfirmationModalOpen(true);
    setIsBookingConfirmed(true);
    document.body.classList.add("modal-open");

    addNotification({
      title: "Booking Confirmed",
      message: `Demo tour “${tourDetails.title}” · ${tourDetails.language} · ${tourDetails.date} ${tourDetails.time} · €${tourDetails.totalPrice}`,
      type: "success",
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Activity Booking Confirmation (Demo)", 10, 10);
    doc.text(`Tour: ${tourDetails.title}`, 10, 20);
    doc.text(`Date: ${tourDetails.date}`, 10, 30);
    doc.text(`Time: ${tourDetails.time}`, 10, 40);
    doc.text(`Participants: ${tourDetails.participants}`, 10, 50);
    doc.text(`Language: ${tourDetails.language}`, 10, 60);
    doc.text(`Total Price: €${tourDetails.totalPrice}`, 10, 70);
    doc.text(`Meeting Point: ${tourDetails.meetingPoint || "TBD"}`, 10, 80);
    doc.text("Demo booking — no real reservation will be made.", 10, 95);
    doc.save("activity_booking_confirmation.pdf");
  };

  return (
    <>
      <div className="modal-overlay" onClick={closeModalHandler} />
      <div className="tour-booking-modal" role="dialog" aria-modal="true" aria-label="Tour booking">
        <h2>Booking Confirmation</h2>
        <div className="tour-details">
          <p>
            <strong>Tour:</strong> {tourDetails.title}
          </p>
          <p>
            <strong>Date:</strong> {tourDetails.date}
          </p>
          <p>
            <strong>Time:</strong> {tourDetails.time}
          </p>
          <p>
            <strong>Participants:</strong> {tourDetails.participants}
          </p>
          <p>
            <strong>Language:</strong> {tourDetails.language}
          </p>
          <p>
            <strong>Duration:</strong> {tourDetails.duration || "—"}
          </p>
          <p>
            <strong>Total price:</strong> €{tourDetails.totalPrice}
          </p>
          <p>
            <strong>Meeting Point:</strong> {tourDetails.meetingPoint}
          </p>
        </div>

        {!isBookingConfirmed && (
          <div className="modal-actions">
            <div className="payment-method">
              <h3>Select Payment Method (demo)</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                aria-label="Payment method"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <DemoDisclaimer />
            <button type="button" className="back-button" onClick={goBack}>
              Go Back
            </button>
            <button type="button" className="confirm-booking-button" onClick={handleConfirmBooking}>
              Confirm Booking
            </button>
          </div>
        )}

        {confirmationModalOpen && (
          <div className="confirmation-modal">
            <h3>Booking Confirmed!</h3>
            <p>
              Your demo activity booking is confirmed
              {activeTrip ? ` and added to ${activeTrip.destination}` : ""}.
            </p>
            <div className="confirmation-options">
              <button type="button" className="download-pdf-button" onClick={handleDownloadPDF}>
                Download as PDF
              </button>
              <button type="button" className="show-qr-code-button" onClick={() => setShowQRCode(true)}>
                Show QR Code
              </button>
              <Link to="/bookings" className="trv-btn trv-btn-primary" onClick={closeModalHandler}>
                View in Bookings
              </Link>
              <Link to="/itinerary" className="trv-btn trv-btn-secondary" onClick={closeModalHandler}>
                Open Itinerary
              </Link>
            </div>
            {showQRCode && (
              <div className="qr-code-display">
                <QRCode
                  value={`DEMO Tour: ${tourDetails.title}\nDate: ${tourDetails.date}\nTime: ${tourDetails.time}\nLanguage: ${tourDetails.language}`}
                  size={128}
                />
              </div>
            )}
            <button type="button" className="close-modal-button" onClick={closeModalHandler}>
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TourBooking;
