import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Stations from "./pages/Stations.jsx";
import StationDetails from "./pages/StationDetails.jsx";
import BatteryFleet from "./pages/BatteryFleet.jsx";
import Riders from "./pages/Riders.jsx";
import RestockIntelligence from "./pages/RestockIntelligence.jsx";
import Revenue from "./pages/revenue.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/stations"
          element={<Stations />}
        />

        <Route
          path="/stations/:id"
          element={<StationDetails />}
        />

        <Route
          path="/battery-fleet"
          element={<BatteryFleet />}
        />

        <Route
          path="/riders"
          element={<Riders />}
        />

        <Route
          path="/restock-intelligence"
          element={<RestockIntelligence />}
        />

        <Route
          path="/revenue"
          element={<Revenue />}
        />

      </Routes>

    </BrowserRouter>
  </StrictMode>
);