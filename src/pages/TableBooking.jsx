import { useState } from "react";
import "../styles/TableBooking.css";
import { jsPDF } from "jspdf";
import { useNotification } from "../contexts/NotificationContext";

const TableBooking = () => {
  const { addNotification } = useNotification();
  const [tables, setTables] = useState([
    {
      id: "T1",
      status: "free",
      seats: 4,
      left: "15%",
      top: "20%",
      rotation: 0,
      shape: "round",
    },
    {
      id: "T2",
      status: "free",
      seats: 6,
      left: "45%",
      top: "20%",
      rotation: 0,
      shape: "rectangle",
    },
    {
      id: "T3",
      status: "occupied",
      seats: 4,
      left: "15%",
      top: "50%",
      rotation: 0,
      shape: "square",
    },
    {
      id: "T4",
      status: "free",
      seats: 4,
      left: "76%",
      top: "50%",
      rotation: 0,
      shape: "round",
    },
    {
      id: "T5",
      status: "free",
      seats: 6,
      left: "48%",
      top: "40%",
      rotation: 90,
      shape: "rectangle",
    },
    {
      id: "T6",
      status: "free",
      seats: 4,
      left: "75%",
      top: "20%",
      rotation: 0,
      shape: "square",
    },
    {
      id: "T7",
      status: "occupied",
      seats: 4,
      left: "15%",
      top: "82%",
      rotation: 0,
      shape: "round",
    },
    {
      id: "T8",
      status: "free",
      seats: 6,
      left: "78%",
      top: "72%",
      rotation: 90,
      shape: "rectangle",
    },
    {
      id: "T9",
      status: "free",
      seats: 4,
      left: "47%",
      top: "83%",
      rotation: 0,
      shape: "square",
    },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [numberOfPersons, setNumberOfPersons] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const restaurantName = "The Gourmet Spot";
  const restaurantAddress = "123 Culinary Lane, Flavor Town, FT 45678";

  const handleTableClick = (id) => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id === id) {
          return {
            ...table,
            status: table.status === "selected" ? "free" : "selected",
          };
        }
        return {
          ...table,
          status: table.status === "selected" ? "free" : table.status,
        };
      })
    );
    setSelectedTable((prevSelected) => (prevSelected === id ? null : id));
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const [day, month, year] = dateValue.split("-");
    setDate(`${day}/${month}/${year}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTable) {
      alert("Please select a table before confirming your booking!");
      return;
    }
    setCurrentStep(3); // Proceed to step 3
  };

  const handleBookingConfirmation = () => {
    addNotification({
      name: restaurantName,
      details: `Table: ${selectedTable}, Date: ${date}, Time: ${time}, People: ${numberOfPersons}`,
    });
    setCurrentStep(4); // Proceed to step 4
  };

  const handleEmail = () => {
    const emailBody = `Booking Details:\n\nRestaurant: ${restaurantName}\nAddress: ${restaurantAddress}\nTable: ${selectedTable}\nDate: ${date}\nTime: ${time}\nNumber of Persons: ${numberOfPersons}\nDietary Restrictions: ${
      dietaryRestrictions || "None"
    }`;
    const mailtoLink = `mailto:?subject=Your Booking Details&body=${encodeURIComponent(
      emailBody
    )}`;
    window.location.href = mailtoLink;
  };

  const handleSms = () => {
    const smsBody = `Booking Details: Restaurant: ${restaurantName}, Address: ${restaurantAddress}, Table: ${selectedTable}, Date: ${date}, Time: ${time}, Number of Persons: ${numberOfPersons}, Dietary Restrictions: ${
      dietaryRestrictions || "None"
    }`;
    const smsLink = `sms:?body=${encodeURIComponent(smsBody)}`;
    window.location.href = smsLink;
  };

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.text("Booking Details", 10, 10);
    doc.text(`Restaurant: ${restaurantName}`, 10, 20);
    doc.text(`Address: ${restaurantAddress}`, 10, 30);
    doc.text(`Table: ${selectedTable}`, 10, 40);
    doc.text(`Date: ${date}`, 10, 50);
    doc.text(`Time: ${time}`, 10, 60);
    doc.text(`Number of Persons: ${numberOfPersons}`, 10, 70);
    doc.text(`Dietary Restrictions: ${dietaryRestrictions || "None"}`, 10, 80);

    doc.save("BookingDetails.pdf");
  };

  return (
    <div className="table-booking-container">
      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
        <div
          className={`step-line ${currentStep > 1 ? "completed" : ""}`}
        ></div>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
        <div
          className={`step-line ${currentStep > 2 ? "completed" : ""}`}
        ></div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
        <div
          className={`step-line ${currentStep > 3 ? "completed" : ""}`}
        ></div>
        <div className={`step ${currentStep >= 4 ? "active" : ""}`}>4</div>
      </div>

      {currentStep === 1 && (
        <>
          <h2>Now it’s time to choose your table</h2>

          {/* Legend */}
          <div className="legend">
            <h3>Legend</h3>
            <div className="legend-item">
              <span className="table free"></span>
              <span className="status">Free</span>
            </div>
            <div className="legend-item">
              <span className="table occupied"></span>
              <span className="status">Occupied</span>
            </div>
            <div className="legend-item">
              <span className="table selected"></span>
              <span className="status">Selected</span>
            </div>
          </div>

          {/* General Facilities */}
          <div className="facilities">
            <h3>General Facilities</h3>
            <ul>
              <li>Free Wi-Fi</li>
              <li>Wheelchair Accessible</li>
              <li>Outdoor Seating</li>
              <li>Pet Friendly</li>
            </ul>
          </div>

          <div className="restaurant-map">
            {tables.map((table) => (
              <div
                key={table.id}
                className="table-container"
                style={{
                  position: "absolute",
                  left: table.left,
                  top: table.top,
                  transform: `translate(-50%, -50%) rotate(${table.rotation}deg)`,
                }}
                onClick={() => {
                  if (table.status === "free" || table.status === "selected") {
                    handleTableClick(table.id);
                  }
                }}
              >
                {/* Render Seats First */}
                <div className="seats">
                  {Array.from({ length: table.seats }).map((_, index) => (
                    <div
                      key={index}
                      className={`seat ${table.status}`} // Apply status only to the seats
                      style={{
                        transform: `rotate(${
                          (360 / table.seats) * index
                        }deg) translate(50px)`,
                      }}
                    ></div>
                  ))}
                </div>

                {/* Render Table After Seats */}
                <div
                  className={`table ${table.status} ${table.shape}`}
                  style={{
                    zIndex: 2, // Ensure table stays above
                  }}
                >
                  <span className="table-id">{table.id}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              window.location.href = "/restaurants";
            }}
          >
            Back
          </button>

          <button onClick={() => setCurrentStep(2)}>Next</button>
        </>
      )}

      {currentStep === 2 && (
        <>
          <form className="table-booking-form">
            <h2>Table Booking Details</h2>
            <label>
              Date:
              <input
                type="date"
                style={{ border: "1px solid #ccc" }}
                onChange={handleDateChange}
                required
              />
            </label>

            <label>
              Time:
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </label>

            <label>
              Number of Persons:
              <input
                style={{ border: "1px solid #ccc", textAlign:"center"}}
                type="number"
                min="1"
                required
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(e.target.value)}
              />
            </label>

            <label>
              Dietary restrictions and/or any other special requests (Optional):
              <input
                type="text"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
              />
            </label>
          </form>

          {/* Buttons Outside the Form */}
          <div className="step-buttons">
            <button onClick={() => setCurrentStep(1)} className="back-btn">
              Back
            </button>
            <button onClick={handleSubmit} className="next-btn">
              Next
            </button>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <div className="booking-recap">
          <h2>Booking Summary</h2>
          <p>
            Table: {selectedTable}
            <br />
            Date: {date}
            <br />
            Time: {time}
            <br />
            People: {numberOfPersons}
            <br />
            Dietary restrictions and/or special requests:{" "}
            {dietaryRestrictions || "None"}
          </p>
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button onClick={handleBookingConfirmation}>Confirm</button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="booking-confirmation">
          <h2>Thank you for your booking!</h2>
          <p>
            Your table has been booked. Below are your booking details:
            <br />
            <strong>Restaurant:</strong> {restaurantName}
            <br />
            <strong>Address:</strong> {restaurantAddress}
          </p>
          <div className="booking-actions">
            <button onClick={handleEmail}>Email Booking</button>
            <button onClick={handleSms}>Send SMS</button>
            <button onClick={handlePdfDownload}>Download as PDF</button>
            <h3>Give us a call if you are a group!</h3>
            <p>+39 0678254698</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBooking;
