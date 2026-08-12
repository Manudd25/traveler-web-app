/* eslint-disable react/prop-types */
import { useState } from "react";
import "../styles/CinemaSeatMap.css";

const DEFAULT_LAYOUT = [
  [0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 0, 0],
  [1, 1, 0, 0, 0, 1, 0, 0, 0],
];

const ROWS = ["A", "B", "C", "D"];

/**
 * Interactive cinema seat map.
 * Seat states: available | reserved | selected
 */
export default function CinemaSeatMap({
  onSeatSelect,
  initialLayout = DEFAULT_LAYOUT,
  reservedSeats = [],
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const isReserved = (seatKey, rowIndex, colIndex) =>
    reservedSeats.includes(seatKey) || initialLayout[rowIndex][colIndex] === 1;

  const handleSeatClick = (rowIndex, colIndex) => {
    const seatKey = `${ROWS[rowIndex]}${colIndex + 1}`;
    if (isReserved(seatKey, rowIndex, colIndex)) return;

    setSelectedSeats((prev) => {
      const next = prev.includes(seatKey)
        ? prev.filter((s) => s !== seatKey)
        : [...prev, seatKey];
      onSeatSelect?.(seatKey, next);
      return next;
    });
  };

  const getStatus = (rowIndex, colIndex) => {
    const seatKey = `${ROWS[rowIndex]}${colIndex + 1}`;
    if (isReserved(seatKey, rowIndex, colIndex)) return "reserved";
    if (selectedSeats.includes(seatKey)) return "selected";
    return "available";
  };

  return (
    <div className="cinema-seat-map" role="group" aria-label="Cinema seat map">
      <div className="cinema-screen" aria-hidden="true">
        <div className="cinema-screen-curve" />
        <span>Screen</span>
      </div>

      <div className="cinema-seat-grid-wrap">
        <div className="cinema-row-labels" aria-hidden="true">
          {ROWS.map((row) => (
            <div key={row} className="cinema-row-label">
              {row}
            </div>
          ))}
        </div>

        <div
          className="cinema-seat-grid"
          style={{ gridTemplateColumns: `repeat(${initialLayout[0].length}, minmax(28px, 1fr))` }}
        >
          {initialLayout.map((row, rowIndex) =>
            row.map((_, colIndex) => {
              const seatKey = `${ROWS[rowIndex]}${colIndex + 1}`;
              const status = getStatus(rowIndex, colIndex);
              const disabled = status === "reserved";

              return (
                <button
                  key={seatKey}
                  type="button"
                  className={`cinema-seat cinema-seat--${status}`}
                  disabled={disabled}
                  aria-label={`Seat ${seatKey}, ${status}`}
                  aria-pressed={status === "selected"}
                  onClick={() => handleSeatClick(rowIndex, colIndex)}
                >
                  <span className="cinema-seat-back" aria-hidden="true" />
                  <span className="cinema-seat-label">{colIndex + 1}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="cinema-col-labels" aria-hidden="true">
        {initialLayout[0].map((_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>

      <div className="cinema-seat-legend">
        <span>
          <i className="cinema-legend-swatch available" aria-hidden="true" /> Available
        </span>
        <span>
          <i className="cinema-legend-swatch selected" aria-hidden="true" /> Selected
        </span>
        <span>
          <i className="cinema-legend-swatch reserved" aria-hidden="true" /> Reserved
        </span>
      </div>
    </div>
  );
}
