import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  UserCheck,
  Activity,
  Wallet,
  Bike,
} from "lucide-react";
import { getRiders } from "../services/api";

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getRiders()
      .then((data) => {
        setRiders(data);
        setError(false);
      })
      .catch((err) => {
        console.error("Failed to load riders:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredRiders = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return riders;

    return riders.filter(
      (rider) =>
        rider.id?.toLowerCase().includes(query) ||
        rider.name?.toLowerCase().includes(query) ||
        rider.rfid?.toLowerCase().includes(query) ||
        rider.vehicle?.toLowerCase().includes(query)
    );
  }, [riders, search]);

  const stats = useMemo(() => {
    const active = riders.filter(
      (rider) => rider.status === "ACTIVE"
    ).length;

    const totalSwaps = riders.reduce(
      (sum, rider) => sum + Number(rider.total_swaps || 0),
      0
    );

    const totalWallet = riders.reduce(
      (sum, rider) => sum + Number(rider.wallet || 0),
      0
    );

    const averageSoc =
      riders.length > 0
        ? riders.reduce(
            (sum, rider) => sum + Number(rider.average_soc || 0),
            0
          ) / riders.length
        : 0;

    return {
      total: riders.length,
      active,
      totalSwaps,
      totalWallet,
      averageSoc,
    };
  }, [riders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center">
        <div className="text-gray-400">
          Loading riders...
        </div>
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

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h2 className="text-lg font-semibold text-red-400">
            Backend connection failed
          </h2>

          <p className="text-gray-400 mt-2">
            Make sure the FastAPI backend is running on port 8000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
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
              Rider Management
            </h1>

            <p className="text-gray-400 mt-1">
              Monitor registered riders and swap activity
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <Activity size={17} className="text-green-400" />
            <span className="text-sm text-green-400">
              Backend Connected
            </span>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <Users className="text-blue-400" />
              <span className="text-2xl font-bold">
                {stats.total}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Total Riders
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <UserCheck className="text-green-400" />
              <span className="text-2xl font-bold">
                {stats.active}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Active Riders
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <Bike className="text-purple-400" />
              <span className="text-2xl font-bold">
                {stats.totalSwaps}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Total Swaps
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <Wallet className="text-yellow-400" />
              <span className="text-2xl font-bold">
                ₹{stats.totalWallet.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Wallet Balance
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5 mb-6">

          <input
            type="text"
            placeholder="Search rider, ID, RFID or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#07111f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50"
          />

        </div>

        {/* Riders Table */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-white/10">

            <h2 className="text-xl font-semibold">
              Registered Riders
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Rider information from SwapOS database
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10">

                  <th className="px-6 py-4">
                    Rider
                  </th>

                  <th className="px-6 py-4">
                    RFID
                  </th>

                  <th className="px-6 py-4">
                    Vehicle
                  </th>

                  <th className="px-6 py-4">
                    Wallet
                  </th>

                  <th className="px-6 py-4">
                    Swaps
                  </th>

                  <th className="px-6 py-4">
                    Avg SoC
                  </th>

                  <th className="px-6 py-4">
                    Last Swap
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredRiders.map((rider) => (
                  <tr
                    key={rider.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Users
                            size={18}
                            className="text-blue-400"
                          />
                        </div>

                        <div>
                          <p className="font-medium">
                            {rider.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {rider.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {rider.rfid}
                    </td>

                    <td className="px-6 py-4">

                      <div>
                        <p className="text-gray-200">
                          {rider.vehicle}
                        </p>

                        <p className="text-xs text-gray-500">
                          {rider.vehicle_type}
                        </p>
                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <span className="text-green-400">
                        ₹
                        {Number(
                          rider.wallet || 0
                        ).toLocaleString("en-IN")}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {rider.total_swaps}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={
                          Number(rider.average_soc) < 25
                            ? "text-red-400"
                            : "text-blue-400"
                        }
                      >
                        {Number(rider.average_soc).toFixed(1)}%
                      </span>

                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {rider.last_swap}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={
                          rider.status === "ACTIVE"
                            ? "inline-flex px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20"
                            : "inline-flex px-3 py-1 rounded-full text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }
                      >
                        {rider.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {filteredRiders.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                No riders found.
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}