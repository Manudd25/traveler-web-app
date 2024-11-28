/* eslint-disable react/prop-types */
import Modal from "react-modal";
import Map from "react-map-gl";
import "../styles/MapModal.css"; 

Modal.setAppElement("#root");

const MapModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Larger Map"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h2>Explore the Map</h2>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
      <Map
        initialViewState={{
          longitude: 12.4964, // Longitude for Rome
          latitude: 41.9028, // Latitude for Rome
          zoom: 15,
        }}
        style={{
          width: "100%", // Full width inside modal
          height: "80vh", // Larger height for better visibility
          borderRadius: "10px",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1IjoibWFudWRkMjUiLCJhIjoiY20zc2w4YWJrMGRmejJyc2M3Njc1MDQ4MCJ9.z4D8vWD6bouX3aWp1tafRQ"
      />
    </Modal>
  );
};

export default MapModal;
