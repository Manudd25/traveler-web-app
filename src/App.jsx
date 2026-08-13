import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AppShell from "./components/layout/AppShell";
import Chatbot from "./components/Chatbot";

import "./styles/design-system.css";
import "./styles/dashboard.css";
import "./App.css";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const MyTrips = lazy(() => import("./pages/dashboard/MyTrips"));
const ItineraryPage = lazy(() => import("./pages/dashboard/ItineraryPage"));
const MapPage = lazy(() => import("./pages/dashboard/MapPage"));
const BookingsHub = lazy(() => import("./pages/dashboard/BookingsHub"));
const BudgetPage = lazy(() => import("./pages/dashboard/BudgetPage"));
const DocumentsPage = lazy(() => import("./pages/dashboard/DocumentsPage"));
const ChecklistPage = lazy(() => import("./pages/dashboard/ChecklistPage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const Discover = lazy(() => import("./pages/dashboard/Discover"));

const Restaurants = lazy(() => import("./pages/Restaurants"));
const TableBooking = lazy(() => import("./pages/TableBooking"));
const Bars = lazy(() => import("./pages/Bars"));
const BarVirtualTour = lazy(() => import("./pages/BarTour"));
const Activities = lazy(() => import("./pages/Activities"));
const Tours = lazy(() => import("./pages/Tours"));
const ActivitiesBooking = lazy(() => import("./pages/ActivitiesBooking"));
const Cinemas = lazy(() => import("./pages/Cinemas"));
const CinemaPage = lazy(() => import("./pages/CinemaPage"));
const CinemaBooking = lazy(() => import("./pages/CinemaBooking"));
const Entertainment = lazy(() => import("./pages/Entertainment"));
const Concerts = lazy(() => import("./pages/Concerts"));
const Clubs = lazy(() => import("./pages/Clubs"));
const Theaters = lazy(() => import("./pages/Theater"));

const Account = lazy(() => import("./components/Account"));
const Login = lazy(() => import("./components/Login"));
const Favorites = lazy(() => import("./components/Favorites"));

function PageLoader() {
  return (
    <div className="trv-page-loader" role="status" aria-live="polite">
      <span className="trv-page-loader-mark" aria-hidden="true">
        <i className="fas fa-plane" />
      </span>
      <span>Loading…</span>
    </div>
  );
}

const App = () => {
  return (
    <Router basename="/">
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route element={<AppShell />}>
                <Route path="/app" element={<Overview />} />
                <Route path="/trips" element={<MyTrips />} />
                <Route path="/itinerary" element={<ItineraryPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/bookings" element={<BookingsHub />} />
                <Route path="/budget" element={<BudgetPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/checklist" element={<ChecklistPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/discover" element={<Discover />} />

                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurants/bars" element={<Bars />} />
                <Route path="/restaurants/pubs" element={<Bars />} />
                <Route path="/bars" element={<Bars />} />
                <Route path="/bar-virtual-tour/:barId" element={<BarVirtualTour />} />
                <Route path="/table-booking/:restaurantId" element={<TableBooking />} />

                <Route path="/activities" element={<Activities />} />
                <Route path="/activities/tours" element={<Tours />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/tour-details/:tourId" element={<ActivitiesBooking />} />
                <Route path="/activities/sports" element={<Activities />} />
                <Route path="/activities/excursions" element={<Activities />} />

                <Route path="/entertainment" element={<Entertainment />} />
                <Route path="/entertainment/cinemas" element={<Cinemas />} />
                <Route path="/cinemas" element={<Cinemas />} />
                <Route path="/cinema-details/:cinemaId" element={<CinemaPage />} />
                <Route path="/cinema-booking-details/:bookingId" element={<CinemaBooking />} />
                <Route path="/entertainment/clubs" element={<Clubs />} />
                <Route path="/entertainment/entertainment" element={<Entertainment />} />
                <Route path="/entertainment/concerts" element={<Concerts />} />
                <Route path="/entertainment/theaters" element={<Theaters />} />

                <Route path="/favorites" element={<Favorites />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </Suspense>
          <Chatbot />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
