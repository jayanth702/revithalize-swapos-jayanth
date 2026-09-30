import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  MapPin,
  Battery,
  Users,
  TrendingUp,
  Bell,
  Zap,
  Activity,
  PackageSearch,
} from "lucide-react";

import { Link } from "react-router-dom";

import { stations } from "./data/station";

import { getDashboard } from "./services/api";

function App() {
  const [backendData, setBackendData] = useState(null);
  const [backendError, setBackendError] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    getDashboard()
      .then((data) => {
        console.log("Backend data:", data);
        setBackendData(data);
        setBackendError(false);
      })
      .catch((error) => {
        console.error("Backend connection failed:", error);
        setBackendError(true);
      });
  }, []);

  const allSlots = stations.flatMap(
    (station) => station.slots
  );

  const totalSlots = allSlots.length;

  const chargedSlots = allSlots.filter(
    (slot) => slot.status === "CHARGED"
  ).length;

  const chargingSlots = allSlots.filter(
    (slot) => slot.status === "CHARGING"
  ).length;

  const emptySlots = allSlots.filter(
    (slot) => slot.status === "EMPTY"
  ).length;

  const faultSlots = allSlots.filter(
    (slot) => slot.status === "FAULT"
  ).length;

  const lowAvailabilityStations = stations.filter(
    (station) => {
      const charged = station.slots.filter(
        (slot) => slot.status === "CHARGED"
      ).length;

      return charged < 2;
    }
  );

  const availabilityPercentage =
    totalSlots > 0
      ? Math.round(
          (chargedSlots / totalSlots) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5">

        {/* Logo */}

        <div className="flex items-center gap-3 mb-10">

          <div className="bg-emerald-500 p-2 rounded-xl">

            <Zap
              size={24}
              className="text-slate-950"
            />

          </div>

          <div>

            <h1 className="text-xl font-bold">
              SwapOS
            </h1>

            <p className="text-xs text-slate-400">
              Network Operations
            </p>

          </div>

        </div>


        {/* Navigation */}

        <nav className="space-y-2">

          {/* Dashboard */}

          <NavItem
            icon={<LayoutDashboard size={19} />}
            text="Dashboard"
            active
          />


          {/* Stations */}

          <Link to="/stations">
            <NavItem
              icon={<MapPin size={19} />}
              text="Stations"
            />
          </Link>


          {/* Battery Fleet */}

          <Link to="/battery-fleet">
            <NavItem
              icon={<Battery size={19} />}
              text="Battery Fleet"
            />
          </Link>


          {/* Riders */}

          <Link to="/riders">
            <NavItem
              icon={<Users size={19} />}
              text="Riders"
            />
          </Link>


          {/* Revenue */}

          <Link to="/revenue">
            <NavItem
              icon={<TrendingUp size={19} />}
              text="Revenue"
            />
          </Link>


          {/* Restock Intelligence */}

          <Link to="/restock-intelligence">
            <NavItem
              icon={<PackageSearch size={19} />}
              text="Restock Intelligence"
            />
          </Link>

        </nav>


        {/* Network Status */}

        <div className="mt-10 p-4 bg-slate-800 rounded-xl">

          <div className="flex items-center gap-2 text-emerald-400">

            <Activity size={18} />

            <span className="text-sm font-semibold">
              Network Status
            </span>

          </div>

          <p className="text-xs text-slate-400 mt-2">
            All systems operational
          </p>

          <div className="h-2 bg-slate-700 rounded-full mt-3">

            <div
              className="h-2 bg-emerald-500 rounded-full"
              style={{
                width: `${availabilityPercentage}%`,
              }}
            ></div>

          </div>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="flex-1">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Operator Dashboard
            </h2>

            <p className="text-sm text-slate-400">
              Battery swap network overview
            </p>

          </div>


          {/* RIGHT HEADER */}

          <div className="flex items-center gap-5">


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div className="relative">

              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setAccountOpen(false);
                }}
                className="relative p-2 rounded-xl hover:bg-slate-800 transition"
                title="Notifications"
              >

                <Bell
                  size={22}
                  className="text-slate-300"
                />

                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {lowAvailabilityStations.length}
                </span>

              </button>


              {/* Notification Dropdown */}

              {notificationOpen && (

                <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50">

                  {/* Header */}

                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">

                    <div>

                      <h3 className="font-semibold text-white">
                        Notifications
                      </h3>

                      <p className="text-xs text-slate-400">
                        Network alerts
                      </p>

                    </div>

                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                      {lowAvailabilityStations.length} alert
                    </span>

                  </div>


                  {/* Notification List */}

                  <div className="p-3">

                    {lowAvailabilityStations.length === 0 ? (

                      <div className="py-6 text-center text-sm text-slate-400">
                        No new notifications
                      </div>

                    ) : (

                      lowAvailabilityStations.map(
                        (station) => (

                          <div
                            key={station.id}
                            className="p-3 rounded-lg hover:bg-slate-800 transition mb-2"
                          >

                            <div className="flex items-start gap-3">

                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>

                              <div>

                                <p className="text-sm font-semibold text-white">
                                  {station.name}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  Fewer than 2 charged slots available
                                </p>

                              </div>

                            </div>

                          </div>

                        )
                      )

                    )}


                    {/* Close */}

                    <div className="border-t border-slate-800 pt-3 mt-2">

                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="w-full text-sm text-slate-400 hover:text-white py-2"
                      >
                        Close
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                OPERATOR ACCOUNT
            ================================================= */}

            <div className="relative">

              <button
                onClick={() => {
                  setAccountOpen(!accountOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-slate-800 transition"
              >

                <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 font-bold">
                  J
                </div>

                <div className="text-left">

                  <p className="text-sm font-semibold">
                    Operator
                  </p>

                  <p className="text-xs text-slate-400">
                    Admin
                  </p>

                </div>

              </button>


              {/* Account Dropdown */}

              {accountOpen && (

                <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50">

                  {/* Account Header */}

                  <div className="p-4 border-b border-slate-800">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 font-bold">
                        J
                      </div>

                      <div>

                        <p className="font-semibold text-white">
                          Operator
                        </p>

                        <p className="text-xs text-slate-400">
                          Admin
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Account Details */}

                  <div className="p-2">

                    <div className="px-3 py-3 rounded-lg hover:bg-slate-800">

                      <p className="text-sm text-white">
                        SwapOS Operator
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Network Operations
                      </p>

                    </div>


                    <div className="px-3 py-3 rounded-lg hover:bg-slate-800">

                      <p className="text-sm text-white">
                        Access Level
                      </p>

                      <p className="text-xs text-emerald-400 mt-1">
                        Administrator
                      </p>

                    </div>


                    <div className="px-3 py-3 rounded-lg hover:bg-slate-800">

                      <p className="text-sm text-white">
                        Environment
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Demo / Development
                      </p>

                    </div>


                    {/* Close */}

                    <div className="border-t border-slate-800 mt-2 pt-2">

                      <button
                        onClick={() => setAccountOpen(false)}
                        className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      >
                        Close
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <section className="p-8">


          {/* Backend Error */}

          {backendError && (

            <div className="mb-6 bg-red-950/40 border border-red-800 rounded-xl p-4">

              <h3 className="text-red-400 font-semibold">
                Backend connection failed
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Make sure the FastAPI backend is running on port 8000.
              </p>

            </div>

          )}


          {/* KPI CARDS */}

          <div className="grid grid-cols-4 gap-5 mb-8">


            <StatCard
              title="Charged Slots"
              value={`${chargedSlots} / ${totalSlots}`}
              subtitle={`${availabilityPercentage}% network availability`}
              icon={<Battery />}
              color="text-emerald-400"
            />


            <StatCard
              title="Swaps Today"
              value={backendData?.total_transactions ?? 0}
              subtitle="Transactions in database"
              icon={<Activity />}
              color="text-blue-400"
            />


            <StatCard
              title="Revenue Today"
              value={`₹${Number(
                backendData?.revenue ?? 0
              ).toLocaleString("en-IN")}`}
              subtitle="Revenue from transactions"
              icon={<TrendingUp />}
              color="text-purple-400"
            />


            <StatCard
              title="Low Availability"
              value={lowAvailabilityStations.length}
              subtitle="Stations need attention"
              icon={<Bell />}
              color="text-red-400"
            />

          </div>


          {/* SLOT SUMMARY */}

          <div className="grid grid-cols-4 gap-4 mb-6">

            <SlotSummary
              title="Charged"
              value={chargedSlots}
              color="bg-emerald-500"
            />

            <SlotSummary
              title="Charging"
              value={chargingSlots}
              color="bg-yellow-400"
            />

            <SlotSummary
              title="Empty"
              value={emptySlots}
              color="bg-slate-500"
            />

            <SlotSummary
              title="Fault"
              value={faultSlots}
              color="bg-red-500"
            />

          </div>


          {/* MAP + ALERTS */}

          <div className="grid grid-cols-3 gap-6">


            {/* MAP */}

            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex justify-between items-center mb-5">

                <div>

                  <h3 className="text-lg font-semibold">
                    Station Network
                  </h3>

                  <p className="text-sm text-slate-400">
                    {stations.length} active stations
                  </p>

                </div>


                <Link
                  to="/stations"
                  className="text-sm bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                  View Stations
                </Link>

              </div>


              {/* Map Placeholder */}

              <div className="h-96 bg-slate-800 rounded-xl relative overflow-hidden">


                {/* Grid */}

                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                ></div>


                {/* Station Pins */}

                <StationPin
                  name="Station 01"
                  position="top-20 left-28"
                />

                <StationPin
                  name="Station 02"
                  position="top-32 right-32"
                />

                <StationPin
                  name="Station 03"
                  position="bottom-28 left-1/2"
                />

                <StationPin
                  name="Station 04"
                  position="bottom-20 left-24"
                />

                <StationPin
                  name="Station 05"
                  position="bottom-16 right-20"
                />


                {/* Map Legend */}

                <div className="absolute bottom-4 left-4 bg-slate-900/90 px-4 py-3 rounded-lg text-xs">

                  <div className="flex items-center gap-2 mb-1">

                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>

                    Healthy

                  </div>


                  <div className="flex items-center gap-2 mb-1">

                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>

                    Low availability

                  </div>


                  <div className="flex items-center gap-2">

                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>

                    Fault

                  </div>

                </div>

              </div>

            </div>


            {/* ALERTS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h3 className="text-lg font-semibold mb-5">
                Network Alerts
              </h3>


              {lowAvailabilityStations.map(
                (station) => (

                  <Alert
                    key={station.id}
                    station={station.name}
                    message="Fewer than 2 charged slots available"
                    type="warning"
                  />

                )
              )}


              <Alert
                station="Station 04"
                message="Battery BAT-1020 health below 80%"
                type="danger"
              />


              <Alert
                station="Station 05"
                message="Restock recommended"
                type="warning"
              />

            </div>

          </div>


          {/* BOTTOM INFORMATION */}

          <div className="grid grid-cols-3 gap-6 mt-6">

            <InfoCard
              title="Total Batteries"
              value={backendData?.total_batteries ?? 0}
              subtitle="Batteries in network"
            />

            <InfoCard
              title="Active Riders"
              value={backendData?.active_riders ?? 0}
              subtitle="Currently active riders"
            />

            <InfoCard
              title="Network Efficiency"
              value={`${availabilityPercentage}%`}
              subtitle="Battery availability"
            />

          </div>

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   NAVIGATION COMPONENT
===================================================== */

function NavItem({
  icon,
  text,
  active,
}) {

  return (

    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
        active
          ? "bg-emerald-500 text-slate-950 font-semibold"
          : "text-slate-300 hover:bg-slate-800"
      }`}
    >

      {icon}

      <span>
        {text}
      </span>

    </div>

  );

}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {value}
          </h3>

        </div>


        <div
          className={`${color} bg-slate-800 p-3 rounded-xl`}
        >

          {icon}

        </div>

      </div>


      <p className="text-xs text-slate-500 mt-4">
        {subtitle}
      </p>

    </div>

  );

}


/* =====================================================
   SLOT SUMMARY
===================================================== */

function SlotSummary({
  title,
  value,
  color,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

      <div className="flex items-center gap-3">

        <span
          className={`w-3 h-3 rounded-full ${color}`}
        ></span>

        <span className="text-sm text-slate-400">
          {title}
        </span>

      </div>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>

    </div>

  );

}


/* =====================================================
   STATION PIN
===================================================== */

function StationPin({
  name,
  position,
}) {

  return (

    <div
      className={`absolute ${position} flex flex-col items-center`}
    >

      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">

        <MapPin
          size={20}
          className="text-slate-950"
        />

      </div>


      <span className="mt-1 text-xs bg-slate-900 px-2 py-1 rounded">
        {name}
      </span>

    </div>

  );

}


/* =====================================================
   ALERT
===================================================== */

function Alert({
  station,
  message,
  type,
}) {

  const isDanger =
    type === "danger";

  return (

    <div className="border-b border-slate-800 pb-4 mb-4">

      <div className="flex gap-3">

        <div
          className={`mt-1 w-2 h-2 rounded-full ${
            isDanger
              ? "bg-red-500"
              : "bg-yellow-400"
          }`}
        ></div>


        <div>

          <p className="text-sm font-semibold">
            {station}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {message}
          </p>

        </div>

      </div>

    </div>

  );

}


/* =====================================================
   INFO CARD
===================================================== */

function InfoCard({
  title,
  value,
  subtitle,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>

      <p className="text-xs text-slate-500 mt-2">
        {subtitle}
      </p>

    </div>

  );

}


export default App;