/* eslint-disable react/prop-types */
import { useState } from "react";

export default function CinemaSeatMap({ onSeatSelect }) {
  const rows = ["A", "B", "C", "D"];
  const seatLayout = [
    [0, 1, 0, 0, 0, 1, 0, 0, 1], // 0: Available, 1: Reserved
    [1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 1, 0, 0, 0],
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (rowIndex, colIndex) => {
    const seatKey = `${rows[rowIndex]}${colIndex + 1}`; // Format: A1, B3, etc.

    setSelectedSeats((prev) => {
      if (prev.includes(seatKey)) {
        // Deselect the seat
        onSeatSelect(seatKey); // Notify parent
        return prev.filter((seat) => seat !== seatKey);
      } else {
        // Select the seat
        onSeatSelect(seatKey); // Notify parent
        return [...prev, seatKey];
      }
    });
  };

  const getSeatStatus = (rowIndex, colIndex) => {
    const seatKey = `${rows[rowIndex]}${colIndex + 1}`;
    if (selectedSeats.includes(seatKey)) return 2; // Selected
    return seatLayout[rowIndex][colIndex]; // Reserved or Available
  };

  const seatColors = {
    0: "#00C7BB", // Available
    1: "#FF4141", // Reserved
    2: "#121212", // Selected (Black)
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 450,
        margin: "0 auto",
        padding: 20,
        background: "white",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: 16,
      }}
    >
      {/* Curved Screen with Label */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 30,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: 12,
            borderTop: "3px solid #00C7BB",
            borderRadius: "50%",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: 15,
            width: "100%",
            textAlign: "center",
            fontSize: 14,
            color: "#00C7BB",
            fontWeight: "bold",
          }}
        >
          Screen
        </div>
      </div>

      {/* Seat Map */}
      <div style={{ display: "flex", gap: 10 }}>
        {/* Row Labels */}
        <div>
          {rows.map((row) => (
            <div
              key={row}
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {row}
            </div>
          ))}
        </div>

        {/* Seat Grid */}
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(9, 40px)" }}>
          {seatLayout.map((row, rowIndex) =>
            row.map((seat, colIndex) => {
              const seatStatus = getSeatStatus(rowIndex, colIndex); // Get seat status dynamically
              const seatKey = `${rows[rowIndex]}${colIndex + 1}`;

              return (
                <div
                  key={seatKey}
                  style={{
                    position: "relative",
                    width: 25,
                    height: 21,
                    background: seatColors[seatStatus],
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: seatStatus === 1 ? "not-allowed" : "pointer",
                    opacity: seatStatus === 1 ? 0.6 : 1,
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => seatStatus !== 1 && handleSeatClick(rowIndex, colIndex)} // Allow clicks only for available seats
                >
                  {/* Backrest (small div on top) */}
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 13,
                      height: 13,
                      border: "1px solid white",
                      background: seatColors[seatStatus],
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column Labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 40px)",
          gap: 10,
          marginTop: 10,
          justifyItems: "center",
        }}
      >
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 20,
          fontSize: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 15,
              height: 15,
              background: "#00C7BB",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          Available
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 15,
              height: 15,
              background: "#FF4141",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          Reserved
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 15,
              height: 15,
              background: "#121212",
              borderRadius: "50%",
              marginRight: 5,
            }}
          ></div>
          Selected
        </div>
      </div>
    </div>
  );
}
