import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  PackageSearch,
  AlertTriangle,
  TrendingUp,
  Zap,
  IndianRupee,
  Battery,
  MapPin,
  Activity,
} from "lucide-react";

import { getStations, getTransactions } from "../services/api";

const ELECTRICITY_RATE = 6.5;

export default function RestockIntelligence() {
  const [stations, setStations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getStations(), getTransactions()])
      .then(([stationData, transactionData]) => {
        setStations(stationData);
        setTransactions(transactionData);
        setError(false);
      })
      .catch((err) => {
        console.error("Failed to load intelligence data:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /*
   * Calculate station-level intelligence.
   *
   * The backend currently provides station-level information
   * and transaction history. Slot-level information is therefore
   * represented using the current 5-station mock configuration.
   */
  const stationIntelligence = useMemo(() => {
    const slotData = {
      1: {
        totalSlots: 6,
        charged: 5,
        charging: 1,
        empty: 0,
        fault: 0,
      },
      2: {
        totalSlots: 6,
        charged: 1,
        charging: 1,
        empty: 3,
        fault: 1,
      },
      3: {
        totalSlots: 6,
        charged: 5,
        charging: 0,
        empty: 1,
        fault: 0,
      },
      4: {
        totalSlots: 6,
        charged: 3,
        charging: 1,
        empty: 1,
        fault: 1,
      },
      5: {
        totalSlots: 6,
        charged: 3,
        charging: 1,
        empty: 1,
        fault: 1,
      },
    };

    return stations.map((station) => {
      const slots = slotData[station.id] || {
        totalSlots: 6,
        charged: 0,
        charging: 0,
        empty: 0,
        fault: 0,
      };

      const stationTransactions = transactions.filter(
        (transaction) =>
          Number(transaction.station_id) === Number(station.id)
      );

      const revenue = stationTransactions.reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount || 0),
        0
      );

      const energy = stationTransactions.reduce(
        (sum, transaction) =>
          sum + Number(transaction.energy || 0),
        0
      );

      const electricityCost = energy * ELECTRICITY_RATE;

      const grossMargin = revenue - electricityCost;

      const availability =
        slots.totalSlots > 0
          ? (slots.charged / slots.totalSlots) * 100
          : 0;

      let priority = "LOW";
      let action = "No immediate restock required.";

      if (slots.empty >= 3 || availability < 35) {
        priority = "CRITICAL";
        action =
          "Dispatch charged batteries immediately.";
      } else if (slots.empty >= 1 || availability < 60) {
        priority = "HIGH";
        action =
          "Schedule battery replenishment.";
      } else if (availability < 80) {
        priority = "MEDIUM";
        action =
          "Monitor demand and prepare reserve batteries.";
      }

      return {
        ...station,
        ...slots,
        revenue,
        energy,
        electricityCost,
        grossMargin,
        availability,
        swaps: stationTransactions.length,
        priority,
        action,
      };
    });
  }, [stations, transactions]);

  const summary = useMemo(() => {
    const revenue = stationIntelligence.reduce(
      (sum, station) => sum + station.revenue,
      0
    );

    const energy = stationIntelligence.reduce(
      (sum, station) => sum + station.energy,
      0
    );

    const electricityCost =
      energy * ELECTRICITY_RATE;

    const grossMargin =
      revenue - electricityCost;

    const critical = stationIntelligence.filter(
      (station) => station.priority === "CRITICAL"
    ).length;

    const high = stationIntelligence.filter(
      (station) => station.priority === "HIGH"
    ).length;

    return {
      revenue,
      energy,
      electricityCost,
      grossMargin,
      critical,
      high,
    };
  }, [stationIntelligence]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading intelligence data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-red-400">
            Backend connection failed
          </h2>

          <p className="text-gray-400 mt-2">
            Make sure the FastAPI backend is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold">
              Restock Intelligence
            </h1>

            <p className="text-gray-400 mt-1">
              Network demand, battery availability and
              station economics
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <Activity
              size={17}
              className="text-green-400"
            />

            <span className="text-sm text-green-400">
              Live Backend Data
            </span>
          </div>

        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">

            <div className="flex justify-between">
              <TrendingUp className="text-purple-400" />

              <span className="text-2xl font-bold">
                ₹
                {summary.revenue.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Network Revenue
            </p>

          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">

            <div className="flex justify-between">
              <Zap className="text-yellow-400" />

              <span className="text-2xl font-bold">
                {summary.energy.toFixed(1)}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Energy Consumed (kWh)
            </p>

          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">

            <div className="flex justify-between">
              <IndianRupee className="text-red-400" />

              <span className="text-2xl font-bold">
                ₹
                {summary.electricityCost.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Electricity Cost
            </p>

            <p className="text-xs text-gray-500 mt-1">
              ₹{ELECTRICITY_RATE}/kWh
            </p>

          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">

            <div className="flex justify-between">
              <TrendingUp className="text-green-400" />

              <span className="text-2xl font-bold">
                ₹
                {summary.grossMargin.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Gross Margin
            </p>

          </div>

        </div>

        {/* ALERT */}

        {(summary.critical > 0 ||
          summary.high > 0) && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 mb-8">

            <div className="flex gap-3">

              <AlertTriangle
                className="text-orange-400 mt-1"
                size={21}
              />

              <div>

                <h2 className="font-semibold text-orange-300">
                  Restock attention required
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {summary.critical} critical station(s)
                  and {summary.high} high-priority
                  station(s) require attention.
                </p>

              </div>

            </div>

          </div>
        )}

        {/* STATION TABLE */}

        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-white/10">

            <div className="flex items-center gap-3">

              <PackageSearch
                className="text-blue-400"
              />

              <div>

                <h2 className="text-xl font-semibold">
                  Station Restock Recommendations
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Prioritized using current charged-slot
                  availability
                </p>

              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10">

                  <th className="px-6 py-4">
                    Station
                  </th>

                  <th className="px-6 py-4">
                    Availability
                  </th>

                  <th className="px-6 py-4">
                    Slots
                  </th>

                  <th className="px-6 py-4">
                    Swaps
                  </th>

                  <th className="px-6 py-4">
                    Revenue
                  </th>

                  <th className="px-6 py-4">
                    Margin
                  </th>

                  <th className="px-6 py-4">
                    Priority
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {stationIntelligence.map(
                  (station) => (
                    <tr
                      key={station.id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <MapPin
                              size={18}
                              className="text-blue-400"
                            />
                          </div>

                          <div>

                            <p className="font-medium">
                              {station.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {station.location}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="w-28">

                          <div className="flex justify-between text-xs mb-1">

                            <span className="text-gray-500">
                              Charged
                            </span>

                            <span className="text-white">
                              {station.availability.toFixed(
                                0
                              )}
                              %
                            </span>

                          </div>

                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">

                            <div
                              className="h-full bg-blue-400 rounded-full"
                              style={{
                                width: `${station.availability}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <Battery
                            size={16}
                            className="text-green-400"
                          />

                          <span>
                            {station.charged}
                          </span>

                          <span className="text-gray-500">
                            /
                          </span>

                          <span className="text-gray-400">
                            {station.totalSlots}
                          </span>

                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {station.empty} empty
                        </p>

                      </td>

                      <td className="px-6 py-5">
                        {station.swaps}
                      </td>

                      <td className="px-6 py-5">

                        ₹
                        {station.revenue.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}

                      </td>

                      <td className="px-6 py-5 text-green-400">

                        ₹
                        {station.grossMargin.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}

                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs border ${
                            station.priority ===
                            "CRITICAL"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : station.priority ===
                                "HIGH"
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              : station.priority ===
                                "MEDIUM"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-green-500/10 text-green-400 border-green-500/20"
                          }`}
                        >
                          {station.priority}
                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <span className="text-sm text-gray-400">
                          {station.action}
                        </span>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        </div>

        {/* BUSINESS LOGIC */}

        <div className="grid md:grid-cols-3 gap-5 mt-8">

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">

            <Battery className="text-blue-400 mb-4" />

            <h3 className="font-semibold">
              Battery Availability
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Stations with fewer charged batteries
              receive higher restock priority.
            </p>

          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">

            <Zap className="text-yellow-400 mb-4" />

            <h3 className="font-semibold">
              Energy Economics
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Electricity cost is calculated using
              ₹6.5 per kWh.
            </p>

          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">

            <TrendingUp className="text-green-400 mb-4" />

            <h3 className="font-semibold">
              Gross Margin
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Gross margin is estimated as revenue
              minus electricity cost.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}