/* eslint-disable react/prop-types */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TripProvider } from "../../contexts/TripContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TripProvider>
      <div className="trv-shell">
        <div
          className={`trv-overlay ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <div className="trv-main">
          <TopBar onMenuClick={() => setSidebarOpen((v) => !v)} />
          <main className="trv-content">
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
    </TripProvider>
  );
}
