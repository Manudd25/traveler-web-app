/* eslint-disable react/prop-types */
import Modal from "react-modal";
import Map from "react-map-gl";
import { MAPBOX_TOKEN } from "../utils/mapboxToken";
import "../styles/MapModal.css";

Modal.setAppElement("#root");

const MapModal = ({
  isOpen,
  onClose,
  latitude = 41.9028,
  longitude = 12.4964,
  title = "Explore the Map",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button type="button" className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
      {isOpen && (
        <Map
          key={`${latitude}-${longitude}`}
          initialViewState={{
            longitude,
            latitude,
            zoom: 13,
          }}
          style={{
            width: "100%",
            height: "70vh",
            borderRadius: "10px",
          }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        />
      )}
    </Modal>
  );
};

export default MapModal;
