import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";

import { stations as localStations } from "../data/station";
import { stationAnalytics } from "../data/analytics";


function getSlotStyle(status) {
  switch (status) {
    case "CHARGED":
      return {
        border: "border-emerald-500/40",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        icon: <CheckCircle2 size={22} />,
      };

    case "CHARGING":
      return {
        border: "border-yellow-500/40",
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        icon: <Zap size={22} />,
      };

    case "EMPTY":
      return {
        border: "border-slate-600",
        bg: "bg-slate-800",
        text: "text-slate-400",
        icon: <Battery size={22} />,
      };

    case "FAULT":
      return {
        border: "border-red-500/40",
        bg: "bg-red-500/10",
        text: "text-red-400",
        icon: <AlertTriangle size={22} />,
      };

    default:
      return {
        border: "border-slate-700",
        bg: "bg-slate-800",
        text: "text-slate-400",
        icon: <Battery size={22} />,
      };
  }
}


function StationDetails() {
  const { id } = useParams();

  const stationId = Number(id);

  const [station, setStation] = useState(null);
  const [batteries, setBatteries] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // LOAD DATA FROM BACKEND
  // ==========================================

  useEffect(() => {
    async function loadStationData() {
      try {
        setLoading(true);
        setError("");

        const [
          stationsResponse,
          batteriesResponse,
          transactionsResponse,
        ] = await Promise.all([
          fetch("https://revithalize-swapos-jayanth.onrender.com/api/stations")
fetch("https://revithalize-swapos-jayanth.onrender.com/api/batteries"),
fetch("https://revithalize-swapos-jayanth.onrender.com/api/transactions"),
        ]);

        if (
          !stationsResponse.ok ||
          !batteriesResponse.ok ||
          !transactionsResponse.ok
        ) {
          throw new Error("Failed to load backend data");
        }

        const backendStations =
          await stationsResponse.json();

        const backendBatteries =
          await batteriesResponse.json();

        const backendTransactions =
          await transactionsResponse.json();


        // Backend station data + local slot data
        const backendStation =
          backendStations.find(
            (item) => item.id === stationId
          );

        const localStation =
          localStations.find(
            (item) => item.id === stationId
          );


        if (!backendStation) {
          setStation(null);
          setLoading(false);
          return;
        }


        setStation({
          ...backendStation,
          slots: localStation?.slots || [],
        });


        // Batteries belonging to this station
        const stationBatteries =
          backendBatteries.filter(
            (battery) =>
              battery.location ===
              backendStation.name
          );

        setBatteries(stationBatteries);


        // Transactions belonging to this station
        const stationTransactions =
          backendTransactions
            .filter(
              (transaction) =>
                transaction.station_id === stationId
            )
            .slice(0, 50);

        setTransactions(stationTransactions);

      } catch (err) {
        console.error(
          "Station details API error:",
          err
        );

        setError(
          "Unable to load station data from backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStationData();
  }, [stationId]);


  // ==========================================
  // ANALYTICS
  // ==========================================

  const analytics =
    stationAnalytics[stationId] || [];


  // ==========================================
  // BATTERY LOOKUP
  // ==========================================

  const batteryMap = useMemo(() => {
    const map = {};

    batteries.forEach((battery) => {
      map[battery.id] = battery;
    });

    return map;
  }, [batteries]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="animate-pulse">

            <Battery
              size={42}
              className="mx-auto text-emerald-400"
            />

          </div>

          <p className="text-slate-400 mt-4">
            Loading station data...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-red-400">
            Backend Connection Error
          </h1>

          <p className="text-slate-400 mt-3">
            {error}
          </p>

          <Link
            to="/stations"
            className="text-emerald-400 mt-5 inline-block"
          >
            ← Back to stations
          </Link>

        </div>

      </div>
    );
  }


  // ==========================================
  // STATION NOT FOUND
  // ==========================================

  if (!station) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-2xl font-bold">
            Station not found
          </h1>

          <Link
            to="/stations"
            className="text-emerald-400 mt-4 inline-block"
          >
            ← Back to stations
          </Link>

        </div>

      </div>
    );
  }


  // ==========================================
  // SLOT COUNTS
  // ==========================================

  const charged =
    station.slots.filter(
      (slot) => slot.status === "CHARGED"
    ).length;

  const charging =
    station.slots.filter(
      (slot) => slot.status === "CHARGING"
    ).length;

  const empty =
    station.slots.filter(
      (slot) => slot.status === "EMPTY"
    ).length;

  const fault =
    station.slots.filter(
      (slot) => slot.status === "FAULT"
    ).length;


  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="border-b border-slate-800 px-8 py-5">

        <div className="flex items-center gap-4">

          <Link
            to="/stations"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>

            <h1 className="text-2xl font-bold">
              {station.name}
            </h1>

            <p className="text-sm text-slate-400">
              {station.location}
            </p>

          </div>

        </div>

      </header>


      <main className="p-8">


        {/* ======================================
            STATION SUMMARY
        ====================================== */}

        <div className="grid grid-cols-4 gap-4 mb-8">

          <SummaryCard
            title="Charged"
            value={charged}
            color="text-emerald-400"
          />

          <SummaryCard
            title="Charging"
            value={charging}
            color="text-yellow-400"
          />

          <SummaryCard
            title="Empty"
            value={empty}
            color="text-slate-400"
          />

          <SummaryCard
            title="Fault"
            value={fault}
            color="text-red-400"
          />

        </div>


        {/* ======================================
            SLOT GRID
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                Battery Slots
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Real-time slot status
              </p>

            </div>


            <div className="flex gap-4 text-xs">

              <StatusLegend
                color="bg-emerald-500"
                text="Charged"
              />

              <StatusLegend
                color="bg-yellow-400"
                text="Charging"
              />

              <StatusLegend
                color="bg-slate-500"
                text="Empty"
              />

              <StatusLegend
                color="bg-red-500"
                text="Fault"
              />

            </div>

          </div>


          {/* 6 SLOT GRID */}

          <div className="grid grid-cols-3 gap-5">

            {station.slots.map((slot) => {

              const style =
                getSlotStyle(slot.status);


              const battery =
                slot.battery
                  ? batteryMap[slot.battery]
                  : null;


              return (

                <div
                  key={slot.id}
                  className={`${style.bg} ${style.border} border rounded-2xl p-5`}
                >

                  {/* SLOT HEADER */}

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-xs text-slate-500">
                        SLOT
                      </p>

                      <h3 className="text-2xl font-bold">
                        {String(
                          slot.number
                        ).padStart(2, "0")}
                      </h3>

                    </div>


                    <div className={style.text}>
                      {style.icon}
                    </div>

                  </div>


                  {/* STATUS */}

                  <div className="mt-4">

                    <span
                      className={`text-xs font-semibold ${style.text}`}
                    >
                      {slot.status}
                    </span>

                  </div>


                  {/* BATTERY */}

                  {battery ? (

                    <div className="mt-5 space-y-3">

                      <div>

                        <p className="text-xs text-slate-500">
                          Battery Serial
                        </p>

                        <p className="text-sm font-semibold">
                          {battery.id}
                        </p>

                      </div>


                      <div className="grid grid-cols-2 gap-3">

                        <BatteryMetric
                          label="SoC"
                          value={`${battery.soc}%`}
                        />

                        <BatteryMetric
                          label="Health"
                          value={`${battery.health}%`}
                        />

                        <BatteryMetric
                          label="Cycles"
                          value={battery.cycles}
                        />

                        <BatteryMetric
                          label="Status"
                          value={battery.status}
                        />

                      </div>

                    </div>

                  ) : (

                    <div className="mt-8 py-6 text-center">

                      <Battery
                        size={30}
                        className="mx-auto text-slate-600"
                      />

                      <p className="text-sm text-slate-500 mt-2">
                        No battery installed
                      </p>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        </div>


        {/* ======================================
            TRANSACTIONS
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-semibold">
                Recent Swap Transactions
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Last 50 completed swaps at this station
              </p>

            </div>


            <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
              {transactions.length} transactions
            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b border-slate-800 text-slate-500">

                  <th className="text-left py-3 px-3">
                    Transaction
                  </th>

                  <th className="text-left py-3 px-3">
                    Rider
                  </th>

                  <th className="text-left py-3 px-3">
                    Battery
                  </th>

                  <th className="text-left py-3 px-3">
                    Date
                  </th>

                  <th className="text-left py-3 px-3">
                    Energy
                  </th>

                  <th className="text-right py-3 px-3">
                    Amount
                  </th>

                  <th className="text-right py-3 px-3">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {transactions.map(
                  (transaction) => (

                    <tr
                      key={transaction.id}
                      className="border-b border-slate-800/60 hover:bg-slate-800/40"
                    >

                      <td className="py-3 px-3 font-medium">
                        {transaction.id}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {transaction.rider}
                      </td>

                      <td className="py-3 px-3 text-slate-400">
                        {transaction.battery}
                      </td>

                      <td className="py-3 px-3 text-slate-400">

                        {transaction.date}

                        <br />

                        <span className="text-xs">
                          {transaction.time}
                        </span>

                      </td>

                      <td className="py-3 px-3 text-slate-400">
                        {transaction.energy} kWh
                      </td>

                      <td className="py-3 px-3 text-right font-semibold">
                        ₹{transaction.amount}
                      </td>

                      <td className="py-3 px-3 text-right">

                        <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                          {transaction.status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* ======================================
            7-DAY ANALYTICS
        ====================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">


          {/* SWAP TREND */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="mb-5">

              <h2 className="text-xl font-semibold">
                7-Day Swap Trend
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Daily completed swaps
              </p>

            </div>


            <div className="h-72">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={analytics}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="swaps"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* REVENUE */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="mb-5">

              <h2 className="text-xl font-semibold">
                7-Day Revenue
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Daily station revenue
              </p>

            </div>


            <div className="h-72">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={analytics}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `₹${value}`,
                      "Revenue",
                    ]}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="#a78bfa"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ==========================================
   SUMMARY CARD
========================================== */

function SummaryCard({
  title,
  value,
  color,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>

    </div>

  );
}


/* ==========================================
   STATUS LEGEND
========================================== */

function StatusLegend({
  color,
  text,
}) {

  return (

    <div className="flex items-center gap-2">

      <span
        className={`w-2 h-2 rounded-full ${color}`}
      ></span>

      {text}

    </div>

  );
}


/* ==========================================
   BATTERY METRIC
========================================== */

function BatteryMetric({
  label,
  value,
}) {

  return (

    <div className="bg-slate-950/40 rounded-lg p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-sm font-semibold mt-1">
        {value}
      </p>

    </div>

  );

}


export default StationDetails;