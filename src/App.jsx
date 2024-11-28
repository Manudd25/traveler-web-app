import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Map from "react-map-gl";
import "./App.css";

// Navbar Pages


//Contexts
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import Chatbot from "./components/Chatbot";
import { NotificationProvider } from "./contexts/NotificationContext";


//Components
import Account from "./components/Account";
import Login from "./components/Login";
import MapModal from "./components/MapModal";
import Navbar from "./components/Navbar"; 
import Favorites from "./components/Favorites";


// Pages for each category
import Restaurants from "./pages/Restaurants";
import TableBooking from "./pages/TableBooking";
import Bars from "./pages/Bars";
import BarVirtualTour from "./pages/BarTour";


import Activities from "./pages/Activities";
import Sports from "./pages/Sports";
import Tours from "./pages/Tours";
import ActivitiesBooking from "./pages/ActivitiesBooking"
import Cinemas from "./pages/Cinemas";
import CinemaPage from "./pages/CinemaPage";
import CinemaBooking from "./pages/CinemaBooking"
import Entertainment from "./pages/Entertainment";
import Concerts from "./pages/Concerts";
import Clubs from "./pages/Clubs";
import Theaters from "./pages/Theater";


// Images
import restaurant from "./assets/restaurant.jpg";
import bars from "./assets/bars.jpg";
import activities from "./assets/activities.jpg";
import tours from "./assets/tours.jpg";
import cinema from "./assets/cinema.jpg";
import entertainment from "./assets/entertainment.jpg";

const App = () => {
  const [city, setCity] = useState("Rome");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setCity("Rome"); // Standard fallback location
        },
        () => {
          setCity("Rome");
        }
      );
    }
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <Router>
      <AuthProvider>
      <NotificationProvider>
        <div className="app-container">
          {/* Navbar */}
       
          <Navbar />
          {/* Main Content */}
          <div className="main-content">
            <Routes>
              {/* Home Page */}
              <Route
                path="/"
                element={
                  <>
                    {/* Map Section */}
                    <div className="map-section">
                      <h2>Your Next Destination</h2>
                      <div className="map-container" onClick={openModal}>
                        <Map
                          initialViewState={{
                            longitude: 12.4964, // Longitude for Rome
                            latitude: 41.9028, // Latitude for Rome
                            zoom: 13,
                          }}
                          style={{
                            width: "100%", // Full-width map
                            height: "300px", // Standard map height
                            borderRadius: "10px",
                          }}
                          mapStyle="mapbox://styles/mapbox/streets-v11"
                          mapboxAccessToken="pk.eyJ1IjoibWFudWRkMjUiLCJhIjoiY20zc2w4YWJrMGRmejJyc2M3Njc1MDQ4MCJ9.z4D8vWD6bouX3aWp1tafRQ"
                        />
                      </div>
                      <p>Real-time Location: {city}</p>
                    </div>

                    {/* Categories Section */}
                    <div className="categories">
                      <Link
                        to="/restaurants"
                        className="category-item"
                        style={{
                          backgroundImage: `url(${restaurant})`,
                        }}
                      >
                        <h3>🍴 Restaurants</h3>
                        <p>Find the best dining experiences nearby.</p>
                      </Link>
                      <Link
                        to="/bars"
                        className="category-item"
                        style={{
                          backgroundImage: `url(${bars})`,
                        }}
                      >
                        <h3>🍹 Bars & Pubs</h3>
                        <p>Unwind with the perfect drink.</p>
                      </Link>
                      <Link
                        to="/activities"
                        className="category-item"
                        style={{
                          backgroundImage: `url(${activities})`,
                        }}
                      >
                        <h3>⚽ Sports & Activities</h3>
                        <p>Stay active and entertained.</p>
                      </Link>
                      <Link
                        to="/tours"
                        className="category-item"
                        style={{
                          backgroundImage: `url(${tours})`,
                        }}
                      >
                        <h3>🚌 Tours & Excursions</h3>
                        <p>Explore guided tours and adventures.</p>
                      </Link>
                      <Link
                        to="/cinemas"
                        className="category-item"
                        style={{
                          backgroundImage: `url(${cinema})`,
                        }}
                      >
                        <h3>🎭 Cinemas & Theaters</h3>
                        <p>Catch the latest movies and shows.</p>
                      </Link>
                      <Link
                        to="/entertainment"
                        className="category-item"
                        style={{
                          backgroundImage: `url(${entertainment})`,
                        }}
                      >
                        <h3>🎉 Entertainment</h3>
                        <p>Enjoy music, festivals, and events.</p>
                      </Link>
                    </div>

                    {/* Map Modal */}
                    <MapModal isOpen={modalIsOpen} onClose={closeModal} />
                  </>
                }
              />

              {/* Category Pages */}
             
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurants/bars" element={<Bars />} />
              <Route path="/bar-virtual-tour/:barId" element={<BarVirtualTour />} />
              <Route path="/restaurants/pubs" element={<Bars />} />
              <Route path="/table-booking/:restaurantId" element={<TableBooking />} />
              
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/tours" element={<Tours />} />
              <Route path="/tour-details/:tourId" element={<ActivitiesBooking />}/>
              <Route path="/activities/sports" element={<Sports />} />
              <Route path="/activities/excursions" element={<Activities />} />
              <Route path="/entertainment" element={<Entertainment />} />

              <Route path="/entertainment/cinemas" element={<Cinemas />} />
              <Route path="/cinema-details/:cinemaId" element={<CinemaPage />} />
              <Route path="/cinema-booking-details/:bookingId" element={<CinemaBooking/>} />
              <Route path="/entertainment/clubs" element={<Clubs />} />
              <Route path="/entertainment/entertainment" element={<Entertainment />} />
              <Route path="/entertainment/concerts" element={<Concerts />} />
              <Route path="/entertainment/theaters" element={<Theaters />} />



              <Route path="/favorites" element={<Favorites />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<Login />} />






            </Routes>
          </div>
          <Chatbot />
        </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
