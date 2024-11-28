import { useState } from 'react';
import TourBooking from './TourBooking';
import '../styles/ActivitiesBooking.css'; // Ensure you have a CSS file for styling

const Tour = {
  type: "Guided Tour",
  title: "Rome: Priority Access Colosseum, Roman Forum & Palatine Tour",
  rating: 4.7,
  reviews: 53946,
  images: [
    "https://cdn.pixabay.com/video/2022/04/30/115528-704906194_tiny.mp4",
    "https://cdn.pixabay.com/photo/2015/08/11/10/59/colosseum-883843_640.jpg",
    "https://cdn.pixabay.com/photo/2013/08/17/18/35/rome-173469_640.jpg",
    "https://cdn.pixabay.com/photo/2016/09/06/10/14/italy-rome-1648721_640.jpg",
  ],
  description:
    "Enjoy exclusive priority access to the Colosseum, Roman Forum, and Palatine Hill on a guided tour. Walk in the footsteps of gladiators and emperors as you travel back to the era of ancient Rome.",
  cancellationPolicy: "Cancel up to 24 hours in advance for a 75% refund.",
  duration: "2.5 hours",
  language: "English",
  originalPrice: "€62.40",
  discountedPrice: "€49.92",
};

const ActivityBooking = () => {
  const activity = Tour;
  const [selectedImage, setSelectedImage] = useState(activity.images[0]);
  const [participants, setParticipants] = useState(1);
  const [selectedDate, setSelectedDate] = useState("Nov 29, 2024");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [tourBookingModalOpen, setTourBookingModalOpen] = useState(false);


    // Calculate the total price based on the number of participants
    const discountedPrice = parseFloat(activity.discountedPrice.replace("€", ""));
    const totalPrice = (discountedPrice * participants).toFixed(2);

    const handleLanguageChange = (e) => {
      console.log("Language selected:", e.target.value);
      setSelectedLanguage(e.target.value);
    };

  const handleCheckAvailability = () => {
    setAvailabilityModalOpen(true);
  };

  const handleCloseModal = () => {
    setAvailabilityModalOpen(false);
  };

  const handleBookNow = () => {
    setTourBookingModalOpen(true);
    setAvailabilityModalOpen(false); // Close availability modal

  };

  const handleGoBackToAvailability = () => {
    setTourBookingModalOpen(false);
    setAvailabilityModalOpen(true);
  };

  return (
    <div className="activity-booking">
      {/* Header Section */}
      <header className="activity-header">
        <p className="activity-type">{activity.type}</p>
        <h1 className="activity-title">{activity.title}</h1>
        <div className="activity-rating-certification">
          <div className="activity-rating">
            <span className="rating-score">{activity.rating} / 5</span>
            <span className="review-count">({activity.reviews} reviews)</span>
          </div>
        </div>
      </header>

      {/* Selected Image Section */}
      <section className="selected-image">
        {selectedImage.endsWith(".mp4") ? (
          <video className="main-video" autoPlay muted loop>
            <source src={selectedImage} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img className="main-image" src={selectedImage} alt="Selected" />
        )}
      </section>

      {/* Thumbnails Section */}
      <section className="activity-thumbnails">
        {activity.images.map((image, index) => (
          <div
            key={index}
            className={`thumbnail-container ${selectedImage === image ? 'active' : ''}`}
            onClick={() => setSelectedImage(image)}
          >
            {image.endsWith(".mp4") ? (
              <video className="thumbnail-video">
                <source src={image} type="video/mp4" />
              </video>
            ) : (
              <img className="thumbnail-image" src={image} alt={`Thumbnail ${index + 1}`} />
            )}
          </div>
        ))}
      </section>

      {/* Description Section */}
      <section className="activity-summary">
        <p className="activity-description">{activity.description}</p>
      </section>

      {/* Details Section */}
      <section className="activity-details">
        <h2>About this activity</h2>
        <ul className="activity-details-list">
          <li>
            <strong>Cancellation policy:</strong> {activity.cancellationPolicy}
          </li>
          <li>
            <strong>Duration:</strong> {activity.duration}
          </li>
          <li>
            <strong>Price:</strong> {activity.discountedPrice} (Free for infants under 5)
          </li>
        </ul>
      </section>

      {/* Booking Options Section */}
      <section className="activity-booking-options">
        <h3 style={{color: "white"}}>Select participants, date, and language</h3>
        <div className="booking-options">
          <div className="option">
            <input
              type="number"
              min="1"
              style={{ textAlign: "center" }}
              value={participants}
              onChange={(e) => setParticipants(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="option">
            <input
              id="date-picker"
              style={{ color: "black" }}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="option">
            <select 
              value={selectedLanguage}
               onChange={handleLanguageChange}
               style={{marginTop: "0.5rem", padding: "0.7rem"}}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <button className="check-availability-button" onClick={handleCheckAvailability}>
            Check availability
          </button>
        </div>
      </section>

      {/* Availability Modal */}
      {availabilityModalOpen && (
  <>
    <div className="modal-overlay" onClick={handleCloseModal}></div>
    <div className="availability-modal">
      <div className="modal-content">
        <h2>Overview Availability</h2>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Participants:</strong> {participants}</p>
        <p><strong>Language:</strong> {selectedLanguage}</p>
        <p><strong>Total Price:</strong> €{totalPrice}</p>
        <h3 style={{color: "red"}}><strong>Only 3 spots left!</strong></h3>
        <button className="close-modal" onClick={handleCloseModal}>
          Close
        </button>
        <button className="continue-booking" onClick={handleBookNow}>
          Book now!
        </button>
      </div>
    </div>
  </>
)}
{/* Tour Booking Modal */}
{tourBookingModalOpen && (
  <TourBooking
    tourDetails={{
      title: activity.title,
      date: selectedDate,
      participants,
      language: selectedLanguage,
      price: totalPrice,
      totalPrice: (parseFloat(activity.discountedPrice.replace("€", "")) * participants).toFixed(2),
    }}
    closeModal={() => setTourBookingModalOpen(false)}
    goBack={handleGoBackToAvailability}
  />
)}

    </div>
    
  );
};

export default ActivityBooking;
