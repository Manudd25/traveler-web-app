import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/TableBooking.css";
import { jsPDF } from "jspdf";
import { useNotification } from "../contexts/NotificationContext";
import { useTrip } from "../contexts/TripContext";
import { BOOKING_TYPES } from "../data/constants";

const STEPS = [
  { id: 1, label: "Choose table" },
  { id: 2, label: "Select date, time, guests" },
  { id: 3, label: "Review and confirm" },
  { id: 4, label: "Confirmation" },
];

/** Floor plan tables — positions relative to the floor canvas */
const INITIAL_TABLES = [
  {
    id: "T1",
    status: "available",
    seats: 2,
    left: "18%",
    top: "22%",
    shape: "round",
    area: "Window",
    description: "Intimate two-top by the window. Ideal for a quiet dinner.",
  },
  {
    id: "T2",
    status: "available",
    seats: 4,
    left: "42%",
    top: "20%",
    shape: "square",
    area: "Indoor",
    description: "Central square table with easy access to the bar.",
  },
  {
    id: "T3",
    status: "reserved",
    seats: 4,
    left: "68%",
    top: "22%",
    shape: "round",
    area: "Indoor",
    description: "Round table near the kitchen pass.",
  },
  {
    id: "T4",
    status: "available",
    seats: 6,
    left: "22%",
    top: "48%",
    shape: "rectangle",
    area: "Window",
    description: "Long table for groups — great natural light from the window wall.",
  },
  {
    id: "T5",
    status: "reserved",
    seats: 2,
    left: "48%",
    top: "46%",
    shape: "round",
    area: "Indoor",
    description: "Compact round table in the centre of the room.",
  },
  {
    id: "T6",
    status: "available",
    seats: 4,
    left: "72%",
    top: "48%",
    shape: "square",
    area: "Indoor",
    description: "Perfect for small groups and located in a quiet area. Near the bar.",
  },
  {
    id: "T7",
    status: "available",
    seats: 6,
    left: "28%",
    top: "74%",
    shape: "rectangle",
    area: "Indoor",
    description: "Spacious rectangular table close to the entrance.",
  },
  {
    id: "T8",
    status: "available",
    seats: 4,
    left: "58%",
    top: "76%",
    shape: "round",
    area: "Indoor",
    description: "Round four-top with a clear view of the room.",
  },
  {
    id: "T9",
    status: "reserved",
    seats: 2,
    left: "80%",
    top: "72%",
    shape: "round",
    area: "Bar",
    description: "High-top style seating near the bar counter.",
  },
];

const AREA_LABEL = {
  Window: "Window",
  Indoor: "Indoor",
  Bar: "Bar",
  Terrace: "Terrace",
};

const TableBooking = () => {
  const { restaurantId } = useParams();
  const { addNotification } = useNotification();
  const { activeTrip, confirmBooking } = useTrip();

  const [tables, setTables] = useState(INITIAL_TABLES);
  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState(activeTrip?.startDate || "");
  const [time, setTime] = useState("");
  const [numberOfPersons, setNumberOfPersons] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const restaurant = useMemo(() => {
    const raw =
      !restaurantId || restaurantId === "undefined"
        ? "A Tasca do Bairro"
        : decodeURIComponent(restaurantId).replace(/[-_]/g, " ");
    const name = raw.replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      name,
      rating: 4.6,
      reviews: 128,
      cuisine: "Portuguese · Traditional",
      address: "Rua da Rosa 123, Lisbon",
    };
  }, [restaurantId]);

  const selectedMeta = tables.find((t) => t.id === selectedTable);

  const visualStatus = (status) => {
    if (status === "free") return "available";
    if (status === "occupied") return "reserved";
    return status;
  };

  const handleTableClick = (id) => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        const status = visualStatus(table.status);
        if (status === "reserved") return table;
        if (table.id === id) {
          return {
            ...table,
            status: status === "selected" ? "available" : "selected",
          };
        }
        return {
          ...table,
          status: status === "selected" ? "available" : table.status,
        };
      })
    );
    setSelectedTable((prev) => (prev === id ? null : id));
  };

  const goToDetails = () => {
    if (!selectedTable) {
      addNotification({
        title: "Select a table",
        message: "Please choose an available table on the floor plan.",
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!date || !time || !numberOfPersons) {
      addNotification({
        title: "Missing details",
        message: "Date, time, and party size are required.",
      });
      return;
    }
    const guests = Number(numberOfPersons);
    if (selectedMeta && guests > selectedMeta.seats) {
      addNotification({
        title: "Too many guests",
        message: `Table ${selectedMeta.id} seats up to ${selectedMeta.seats}.`,
      });
      return;
    }
    setCurrentStep(3);
  };

  const handleBookingConfirmation = () => {
    setTables((prev) =>
      prev.map((t) => (t.id === selectedTable ? { ...t, status: "reserved" } : t))
    );

    const guests = Number(numberOfPersons) || 1;
    const estimated = guests * 28;

    if (activeTrip) {
      confirmBooking(activeTrip.id, {
        type: BOOKING_TYPES.RESTAURANT,
        title: `Dinner at ${restaurant.name}`,
        date,
        time,
        totalPrice: estimated,
        location: restaurant.name,
        notes: dietaryRestrictions || `Table ${selectedTable}`,
        details: {
          tableId: selectedTable,
          guests,
          area: selectedMeta?.area,
          capacity: selectedMeta?.seats,
          dietaryRestrictions,
          restaurantAddress: restaurant.address,
        },
      });
    }

    addNotification({
      title: "Table reserved",
      message: `Demo booking · ${restaurant.name} · Table ${selectedTable} · ${date} ${time}`,
      type: "success",
    });
    setCurrentStep(4);
  };

  const handleEmail = () => {
    const body = `Booking Details:\n\nRestaurant: ${restaurant.name}\nAddress: ${restaurant.address}\nTable: ${selectedTable}\nDate: ${date}\nTime: ${time}\nGuests: ${numberOfPersons}\nNotes: ${
      dietaryRestrictions || "None"
    }\n\nDemo booking — no real reservation will be made.`;
    window.location.href = `mailto:?subject=Your Booking Details&body=${encodeURIComponent(body)}`;
  };

  const handleSms = () => {
    const sms = `Demo booking: ${restaurant.name}, Table ${selectedTable}, ${date} ${time}, ${numberOfPersons} guests`;
    window.location.href = `sms:?body=${encodeURIComponent(sms)}`;
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.text("Restaurant Booking (Demo)", 10, 10);
    doc.text(`Restaurant: ${restaurant.name}`, 10, 20);
    doc.text(`Address: ${restaurant.address}`, 10, 30);
    doc.text(`Table: ${selectedTable}`, 10, 40);
    doc.text(`Area: ${selectedMeta?.area || "Indoor"}`, 10, 50);
    doc.text(`Date: ${date}`, 10, 60);
    doc.text(`Time: ${time}`, 10, 70);
    doc.text(`Guests: ${numberOfPersons}`, 10, 80);
    doc.text(`Notes: ${dietaryRestrictions || "None"}`, 10, 90);
    doc.text("Demo booking — no real reservation will be made.", 10, 105);
    doc.save("restaurant_booking.pdf");
  };

  return (
    <div className="rb-page">
      <nav className="rb-breadcrumb" aria-label="Breadcrumb">
        <Link to="/bookings">Bookings</Link>
        <span aria-hidden="true">›</span>
        <Link to="/restaurants">Restaurants</Link>
        <span aria-hidden="true">›</span>
        <span>{restaurant.name}</span>
      </nav>

      <header className="rb-restaurant-header">
        <Link to="/restaurants" className="rb-back">
          <i className="fas fa-arrow-left" aria-hidden="true" />
          Back to restaurants
        </Link>

        <div className="rb-restaurant-title-row">
          <div>
            <h1 className="rb-restaurant-name">{restaurant.name}</h1>
            <div className="rb-restaurant-meta">
              <span className="rb-rating" aria-label={`${restaurant.rating} out of 5 stars`}>
                <i className="fas fa-star" aria-hidden="true" />
                {restaurant.rating}
                <span className="rb-muted"> ({restaurant.reviews} reviews)</span>
              </span>
              <span className="rb-dot" aria-hidden="true" />
              <span>{restaurant.cuisine}</span>
              <span className="rb-dot" aria-hidden="true" />
              <span>
                <i className="fas fa-map-marker-alt" aria-hidden="true" /> {restaurant.address}
              </span>
            </div>
          </div>
        </div>
      </header>

      <ol className="rb-stepper" aria-label="Booking progress">
        {STEPS.map((step) => {
          const state =
            currentStep === step.id ? "current" : currentStep > step.id ? "done" : "upcoming";
          return (
            <li key={step.id} className={`rb-step rb-step--${state}`}>
              <span className="rb-step-index" aria-hidden="true">
                {currentStep > step.id ? <i className="fas fa-check" /> : step.id}
              </span>
              <span className="rb-step-label">{step.label}</span>
            </li>
          );
        })}
      </ol>

      {currentStep === 1 && (
        <section className="rb-step-panel" aria-labelledby="rb-step1-title">
          <div className="rb-step1-layout">
            <div className="rb-floor-column">
              <div className="rb-floor-heading">
                <h2 id="rb-step1-title">Choose your table</h2>
                <ul className="rb-legend" aria-label="Table status legend">
                  <li>
                    <span className="rb-swatch rb-swatch--available" aria-hidden="true" />
                    Available
                  </li>
                  <li>
                    <span className="rb-swatch rb-swatch--selected" aria-hidden="true" />
                    Selected
                  </li>
                  <li>
                    <span className="rb-swatch rb-swatch--reserved" aria-hidden="true" />
                    Reserved
                  </li>
                </ul>
              </div>

              <div className="rb-floor-plan" role="group" aria-label="Restaurant floor plan">
                <span className="rb-zone rb-zone--window">Window</span>
                <span className="rb-zone rb-zone--kitchen">Kitchen</span>
                <span className="rb-zone rb-zone--bar">Bar</span>
                <span className="rb-zone rb-zone--entrance">
                  Entrance <i className="fas fa-arrow-down" aria-hidden="true" />
                </span>
                <span className="rb-plant rb-plant--tl" aria-hidden="true" />
                <span className="rb-plant rb-plant--tr" aria-hidden="true" />
                <span className="rb-plant rb-plant--bl" aria-hidden="true" />

                {tables.map((table) => {
                  const status = visualStatus(table.status);
                  const interactive = status === "available" || status === "selected";
                  return (
                    <button
                      key={table.id}
                      type="button"
                      className={`rb-table rb-table--${table.shape} rb-table--${status}`}
                      style={{ left: table.left, top: table.top }}
                      disabled={!interactive}
                      aria-label={`Table ${table.id}, ${table.seats} seats, ${table.area}, ${status}`}
                      aria-pressed={status === "selected"}
                      onClick={() => interactive && handleTableClick(table.id)}
                    >
                      <span className="rb-table-id">{table.id}</span>
                      <span className="rb-table-seats">{table.seats} seats</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="rb-side-panel" aria-live="polite">
              {selectedMeta ? (
                <div className="rb-table-card">
                  <p className="rb-table-card-kicker">Selected table</p>
                  <h3>Table {selectedMeta.id}</h3>
                  <p className="rb-table-card-meta">
                    {selectedMeta.seats} seats · {AREA_LABEL[selectedMeta.area] || selectedMeta.area}
                  </p>
                  <p className="rb-table-card-desc">{selectedMeta.description}</p>
                  <button type="button" className="rb-btn rb-btn-primary" onClick={goToDetails}>
                    Continue
                  </button>
                  <p className="rb-helper">You can select the date and time next.</p>
                </div>
              ) : (
                <div className="rb-table-card rb-table-card--empty">
                  <h3>Select a table</h3>
                  <p>
                    Click an available table on the floor plan. Reserved tables cannot be selected.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      {currentStep === 2 && (
        <section className="rb-step-panel rb-form-panel" aria-labelledby="rb-step2-title">
          <h2 id="rb-step2-title">Select date, time & guests</h2>
          <p className="rb-form-intro">
            Table <strong>{selectedTable}</strong>
            {selectedMeta
              ? ` · ${selectedMeta.seats} seats · ${AREA_LABEL[selectedMeta.area] || selectedMeta.area}`
              : ""}
          </p>

          <form className="rb-form" onSubmit={handleDetailsSubmit}>
            <div className="rb-field">
              <label htmlFor="rb-date">Date</label>
              <input
                id="rb-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="rb-field">
              <label htmlFor="rb-time">Time</label>
              <input
                id="rb-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="rb-field">
              <label htmlFor="rb-guests">Number of guests</label>
              <input
                id="rb-guests"
                type="number"
                min="1"
                max={selectedMeta?.seats || 12}
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(e.target.value)}
                required
              />
            </div>
            <div className="rb-field rb-field--full">
              <label htmlFor="rb-notes">Dietary restrictions / special requests (optional)</label>
              <input
                id="rb-notes"
                type="text"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                placeholder="Allergies, high chair, celebration…"
              />
            </div>

            <div className="rb-form-actions">
              <button type="button" className="rb-btn rb-btn-secondary" onClick={() => setCurrentStep(1)}>
                Back
              </button>
              <button type="submit" className="rb-btn rb-btn-primary">
                Continue to review
              </button>
            </div>
          </form>
        </section>
      )}

      {currentStep === 3 && (
        <section className="rb-step-panel rb-form-panel" aria-labelledby="rb-step3-title">
          <h2 id="rb-step3-title">Review and confirm</h2>
          <p className="rb-form-intro">Check your details before confirming the demo booking.</p>

          <dl className="rb-summary">
            <div>
              <dt>Restaurant</dt>
              <dd>{restaurant.name}</dd>
            </div>
            <div>
              <dt>Table</dt>
              <dd>
                {selectedTable} · {selectedMeta?.seats} seats ·{" "}
                {AREA_LABEL[selectedMeta?.area] || selectedMeta?.area}
              </dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{date}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{time}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd>{numberOfPersons}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{dietaryRestrictions || "None"}</dd>
            </div>
          </dl>

          <p className="rb-disclaimer rb-disclaimer--footer" role="note">
            <i className="fas fa-info-circle" aria-hidden="true" />
            Demo booking — no real reservation will be made.
          </p>

          <div className="rb-form-actions">
            <button type="button" className="rb-btn rb-btn-secondary" onClick={() => setCurrentStep(2)}>
              Back
            </button>
            <button type="button" className="rb-btn rb-btn-primary" onClick={handleBookingConfirmation}>
              Confirm booking
            </button>
          </div>
        </section>
      )}

      {currentStep === 4 && (
        <section className="rb-step-panel rb-form-panel rb-confirm" aria-labelledby="rb-step4-title">
          <div className="rb-confirm-badge" aria-hidden="true">
            <i className="fas fa-check" />
          </div>
          <h2 id="rb-step4-title">Booking confirmed</h2>
          <p>
            Your demo table reservation at <strong>{restaurant.name}</strong> is confirmed
            {activeTrip ? ` and synced to ${activeTrip.destination}` : ""}.
          </p>
          <p className="rb-confirm-details">
            Table {selectedTable} · {date} · {time} · {numberOfPersons} guests
          </p>

          <div className="rb-confirm-actions">
            <button type="button" className="rb-btn rb-btn-secondary" onClick={handleEmail}>
              Email booking
            </button>
            <button type="button" className="rb-btn rb-btn-secondary" onClick={handleSms}>
              Send SMS
            </button>
            <button type="button" className="rb-btn rb-btn-secondary" onClick={handlePdfDownload}>
              Download PDF
            </button>
            <Link to="/bookings" className="rb-btn rb-btn-primary">
              View in Bookings
            </Link>
            <Link to="/itinerary" className="rb-btn rb-btn-secondary">
              Open Itinerary
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default TableBooking;
