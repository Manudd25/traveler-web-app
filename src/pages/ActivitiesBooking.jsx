import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import TourBooking from "./TourBooking";
import DemoDisclaimer from "../components/bookings/DemoDisclaimer";
import { useTrip } from "../contexts/TripContext";
import { useTripDestination } from "../hooks/useTripDestination";
import { fetchCityImages } from "../utils/fetchCityImages";
import { resolveTripCover } from "../utils/tripCovers";
import "../styles/ActivitiesBooking.css";

const LANGUAGE_AVAILABILITY = {
  English: ["09:00", "10:30", "15:00"],
  Spanish: ["10:30", "16:00"],
  German: ["09:00"],
  Italian: ["15:00"],
  French: ["11:00", "14:30"],
};

const TOUR_CATALOG = {
  lisbon: {
    type: "Guided Tour",
    title: "Lisbon Old Town Walking Tour",
    rating: 4.8,
    reviews: 12420,
    images: [
      "https://cdn.pixabay.com/photo/2019/10/08/18/59/lisbon-4535489_640.jpg",
      "https://cdn.pixabay.com/photo/2018/02/27/16/25/portugal-3186174_640.jpg",
      "https://cdn.pixabay.com/photo/2016/11/14/03/38/lisbon-1822534_640.jpg",
    ],
    description:
      "Explore Alfama and the historic centre with a local guide. Learn about Lisbon’s hills, viewpoints, and neighbourhood stories on an intimate walking tour.",
    cancellationPolicy: "Cancel up to 24 hours in advance for a full refund.",
    duration: "2.5 hours",
    meetingPoint: "Rossio Square, by the fountain",
    pricePerPerson: 25,
    location: "Lisbon",
    coordinates: { lat: 38.7139, lng: -9.1394 },
  },
  rome: {
    type: "Guided Tour",
    title: "Rome: Priority Access Colosseum, Roman Forum & Palatine Tour",
    rating: 4.7,
    reviews: 53946,
    images: [
      "https://cdn.pixabay.com/photo/2015/08/11/10/59/colosseum-883843_640.jpg",
      "https://cdn.pixabay.com/photo/2013/08/17/18/35/rome-173469_640.jpg",
      "https://cdn.pixabay.com/photo/2016/09/06/10/14/italy-rome-1648721_640.jpg",
    ],
    description:
      "Enjoy exclusive priority access to the Colosseum, Roman Forum, and Palatine Hill on a guided tour.",
    cancellationPolicy: "Cancel up to 24 hours in advance for a 75% refund.",
    duration: "2.5 hours",
    meetingPoint: "Underground stop: Metro B 'Colosseo'",
    pricePerPerson: 49.92,
    location: "Rome",
    coordinates: { lat: 41.8902, lng: 12.4922 },
  },
};

function pickCatalogKey(tourId, tripCity, cityName) {
  const key = String(tourId || "").toLowerCase();
  const haystack = `${tripCity} ${cityName}`.toLowerCase();

  if (key.includes("colosseum") || key.includes("rome") || key.includes("vatican")) {
    return "rome";
  }
  if (key.includes("lisbon") || key.includes("belem") || key.includes("alfama")) {
    return "lisbon";
  }
  if (haystack.includes("rome") || haystack.includes("roma")) return "rome";
  if (haystack.includes("lisbon") || haystack.includes("lisboa")) return "lisbon";
  return haystack.includes("rome") ? "rome" : "lisbon";
}

const ActivityBooking = () => {
  const { tourId } = useParams();
  const location = useLocation();
  const { activeTrip } = useTrip();
  const { cityName } = useTripDestination();

  const tourFromList = location.state?.tour;
  const pageCity =
    location.state?.cityName ||
    cityName ||
    activeTrip?.city ||
    activeTrip?.destination ||
    "Lisbon";

  const baseActivity = useMemo(() => {
    const tripCity = `${activeTrip?.city || ""} ${activeTrip?.destination || ""}`;
    const catalogKey = pickCatalogKey(tourId, tripCity, pageCity);
    const catalog = TOUR_CATALOG[catalogKey];

    return {
      ...catalog,
      title: tourFromList?.name || catalog.title,
      type: tourFromList?.type || catalog.type,
      description:
        tourFromList?.description ||
        catalog.description.replace(/\b(Lisbon|Rome)\b/gi, pageCity),
      duration: tourFromList?.duration || catalog.duration,
      location: pageCity,
      images: [
        ...(tourFromList?.image ? [tourFromList.image] : []),
        ...catalog.images,
      ].filter((url, index, arr) => url && arr.indexOf(url) === index),
    };
  }, [tourId, activeTrip?.city, activeTrip?.destination, pageCity, tourFromList]);

  const [activity, setActivity] = useState(baseActivity);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(baseActivity.images[0]);
  const [participants, setParticipants] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedTime, setSelectedTime] = useState(LANGUAGE_AVAILABILITY.English[0]);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [tourBookingModalOpen, setTourBookingModalOpen] = useState(false);

  useEffect(() => {
    setActivity(baseActivity);
    setSelectedImage(baseActivity.images[0]);
  }, [baseActivity]);

  useEffect(() => {
    let cancelled = false;

    const loadCityPhotos = async () => {
      setImagesLoading(true);
      const query = tourFromList?.name
        ? `${pageCity} ${tourFromList.name}`
        : `${pageCity} travel landmark`;

      const fetched = await fetchCityImages(query, { perPage: 12 });
      const cityFallback = resolveTripCover({
        city: pageCity,
        destination: pageCity,
        coverImage: activeTrip?.coverImage,
      });

      const gallery = [
        ...(tourFromList?.image ? [tourFromList.image] : []),
        ...fetched,
        cityFallback,
        ...baseActivity.images,
      ].filter((url, index, arr) => url && arr.indexOf(url) === index);

      if (!cancelled) {
        setActivity((prev) => ({
          ...prev,
          ...baseActivity,
          location: pageCity,
          images: gallery.slice(0, 6),
        }));
        setSelectedImage(gallery[0]);
        setImagesLoading(false);
      }
    };

    loadCityPhotos();
    return () => {
      cancelled = true;
    };
  }, [pageCity, tourFromList, tourId, activeTrip?.coverImage, baseActivity]);

  const languages = Object.keys(LANGUAGE_AVAILABILITY);
  const totalPrice = (activity.pricePerPerson * participants).toFixed(2);
  const slots = LANGUAGE_AVAILABILITY[selectedLanguage] || [];

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    const nextSlots = LANGUAGE_AVAILABILITY[lang] || [];
    setSelectedTime(nextSlots[0] || "");
  };

  const handleCheckAvailability = () => {
    if (!selectedDate || !selectedTime) return;
    setAvailabilityModalOpen(true);
  };

  return (
    <div className="activity-booking">
      <header className="activity-header">
        <p className="activity-type">{activity.type}</p>
        <h1 className="activity-title">{activity.title}</h1>
        <p className="activity-subtitle">
          {pageCity} · {activity.duration} · from €{activity.pricePerPerson.toFixed(2)}
        </p>
        <div className="activity-rating">
          <span className="rating-score">{activity.rating} / 5</span>
          <span className="review-count">({activity.reviews} reviews)</span>
        </div>
      </header>

      <section className="selected-image">
        {imagesLoading ? (
          <img
            src="/loading.gif"
            alt="Loading city photos"
            className="activity-loading"
          />
        ) : selectedImage?.endsWith?.(".mp4") ? (
          <video className="main-video" autoPlay muted loop>
            <source src={selectedImage} type="video/mp4" />
          </video>
        ) : (
          <img className="main-image" src={selectedImage} alt={`${activity.title} in ${pageCity}`} />
        )}
      </section>

      <section className="activity-thumbnails">
        {activity.images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={`thumbnail-container ${selectedImage === image ? "active" : ""}`}
            onClick={() => setSelectedImage(image)}
            aria-label={`View image ${index + 1}`}
          >
            <img className="thumbnail-image" src={image} alt="" />
          </button>
        ))}
      </section>

      <section className="activity-summary">
        <p className="activity-description">{activity.description}</p>
      </section>

      <section className="activity-details">
        <h2>About this activity</h2>
        <ul className="activity-details-list">
          <li>
            <strong>Location</strong>
            <span>{activity.location}</span>
          </li>
          <li>
            <strong>Duration</strong>
            <span>{activity.duration}</span>
          </li>
          <li>
            <strong>Meeting point</strong>
            <span>{activity.meetingPoint}</span>
          </li>
          <li>
            <strong>Cancellation</strong>
            <span>{activity.cancellationPolicy}</span>
          </li>
          <li>
            <strong>Price</strong>
            <span>€{activity.pricePerPerson.toFixed(2)} per person</span>
          </li>
        </ul>
      </section>

      <section className="activity-booking-options">
        <h3>Select participants, date, language & time</h3>
        <p className="booking-options-intro">Available slots depend on the selected language.</p>
        <div className="booking-options">
          <div className="option">
            <label htmlFor="participants">Participants</label>
            <input
              id="participants"
              type="number"
              min="1"
              max="12"
              value={participants}
              onChange={(e) => setParticipants(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </div>
          <div className="option">
            <label htmlFor="tour-date">Date</label>
            <input
              id="tour-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="option">
            <label htmlFor="tour-lang">Language</label>
            <select id="tour-lang" value={selectedLanguage} onChange={handleLanguageChange}>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="option">
            <label htmlFor="tour-time">Time slot ({selectedLanguage})</label>
            <select
              id="tour-time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          className="check-availability-button"
          onClick={handleCheckAvailability}
          disabled={!selectedDate || !selectedTime}
        >
          Check availability · €{totalPrice}
        </button>
        <DemoDisclaimer className="activity-disclaimer" />
      </section>

      {availabilityModalOpen && (
        <>
          <div className="modal-overlay" onClick={() => setAvailabilityModalOpen(false)} />
          <div className="availability-modal">
            <div className="modal-content">
              <h2>Overview Availability</h2>
              <p>
                <strong>Activity:</strong> {activity.title}
              </p>
              <p>
                <strong>Date:</strong> {selectedDate}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
              <p>
                <strong>Participants:</strong> {participants}
              </p>
              <p>
                <strong>Language:</strong> {selectedLanguage}
              </p>
              <p>
                <strong>Duration:</strong> {activity.duration}
              </p>
              <p>
                <strong>Total Price:</strong> €{totalPrice}
              </p>
              <h3 style={{ color: "var(--trv-danger, #d64545)" }}>
                <strong>Only a few spots left!</strong>
              </h3>
              <button type="button" className="close-modal" onClick={() => setAvailabilityModalOpen(false)}>
                Close
              </button>
              <button
                type="button"
                className="continue-booking"
                onClick={() => {
                  setTourBookingModalOpen(true);
                  setAvailabilityModalOpen(false);
                }}
              >
                Book now!
              </button>
            </div>
          </div>
        </>
      )}

      {tourBookingModalOpen && (
        <TourBooking
          tourDetails={{
            title: activity.title,
            date: selectedDate,
            time: selectedTime,
            participants,
            language: selectedLanguage,
            duration: activity.duration,
            meetingPoint: activity.meetingPoint,
            location: activity.location,
            pricePerPerson: activity.pricePerPerson,
            totalPrice,
            coordinates: activity.coordinates,
          }}
          closeModal={() => setTourBookingModalOpen(false)}
          goBack={() => {
            setTourBookingModalOpen(false);
            setAvailabilityModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default ActivityBooking;
