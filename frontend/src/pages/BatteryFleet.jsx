import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Battery,
  MapPin,
  Activity,
  AlertTriangle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { getBatteries } from "../services/api";

function getBatteryFlags(battery) {
  const flags = [];

  if (battery.cycles > 2000) {
    flags.push("HIGH_CYCLES");
  }

  if (battery.health < 80) {
    flags.push("LOW_HEALTH");
  }

  if (Number(battery.deep_discharge) === 1) {
    flags.push("DEEP_DISCHARGE");
  }

  return flags;
}

function statusClasses(status) {
  switch (status) {
    case "CHARGED":
      return "bg-green-500/10 text-green-400 border-green-500/20";

    case "CHARGING":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";

    case "FAULT":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

export default function BatteryFleet() {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBatteries()
      .then((data) => {
        setBatteries(data);
        setError(false);
      })
      .catch((err) => {
        console.error("Failed to load batteries:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const total = batteries.length;

    const charged = batteries.filter(
      (battery) => battery.status === "CHARGED"
    ).length;

    const charging = batteries.filter(
      (battery) => battery.status === "CHARGING"
    ).length;

    const fault = batteries.filter(
      (battery) => battery.status === "FAULT"
    ).length;

    const maintenance = batteries.filter(
      (battery) => getBatteryFlags(battery).length > 0
    ).length;

    return {
      total,
      charged,
      charging,
      fault,
      maintenance,
    };
  }, [batteries]);

  const maintenanceQueue = useMemo(() => {
    return batteries
      .map((battery) => ({
        ...battery,
        flags: getBatteryFlags(battery),
      }))
      .filter((battery) => battery.flags.length > 0);
  }, [batteries]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center">
        <div className="text-gray-400">Loading battery fleet...</div>
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
              Battery Fleet
            </h1>

            <p className="text-gray-400 mt-1">
              Monitor battery health, charging status and maintenance
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <Battery className="text-blue-400" />
              <span className="text-2xl font-bold">
                {stats.total}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Total Batteries
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="text-green-400" />
              <span className="text-2xl font-bold">
                {stats.charged}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Charged
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <Activity className="text-blue-400" />
              <span className="text-2xl font-bold">
                {stats.charging}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Charging
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <AlertTriangle className="text-red-400" />
              <span className="text-2xl font-bold">
                {stats.fault}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Fault
            </p>
          </div>

          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <Wrench className="text-yellow-400" />
              <span className="text-2xl font-bold">
                {stats.maintenance}
              </span>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              Maintenance
            </p>
          </div>

        </div>

        {/* Maintenance Queue */}
        {maintenanceQueue.length > 0 && (
          <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6 mb-8">

            <div className="flex items-center gap-3 mb-5">
              <Wrench className="text-yellow-400" />

              <div>
                <h2 className="text-xl font-semibold">
                  Maintenance Queue
                </h2>

                <p className="text-sm text-gray-400">
                  Batteries requiring inspection or maintenance
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              {maintenanceQueue.map((battery) => (
                <div
                  key={battery.id}
                  className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">

                    <span className="font-semibold">
                      {battery.id}
                    </span>

                    <AlertTriangle
                      size={18}
                      className="text-yellow-400"
                    />

                  </div>

                  <div className="mt-3 text-sm text-gray-400">
                    <p>
                      Health:{" "}
                      <span className="text-white">
                        {battery.health}%
                      </span>
                    </p>

                    <p>
                      Cycles:{" "}
                      <span className="text-white">
                        {battery.cycles}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {battery.flags.map((flag) => (
                      <span
                        key={flag}
                        className="px-2 py-1 rounded-lg text-xs bg-yellow-500/10 text-yellow-400"
                      >
                        {flag.replaceAll("_", " ")}
                      </span>
                    ))}

                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* Battery Inventory */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold">
              Battery Inventory
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Live battery fleet data from SwapOS backend
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 border-b border-white/10">

                  <th className="px-6 py-4">
                    Battery
                  </th>

                  <th className="px-6 py-4">
                    Station
                  </th>

                  <th className="px-6 py-4">
                    SoC
                  </th>

                  <th className="px-6 py-4">
                    Health
                  </th>

                  <th className="px-6 py-4">
                    Cycles
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Alerts
                  </th>

                </tr>
              </thead>

              <tbody>

                {batteries.map((battery) => {
                  const flags = getBatteryFlags(battery);

                  return (
                    <tr
                      key={battery.id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Battery
                              size={18}
                              className="text-blue-400"
                            />
                          </div>

                          <span className="font-medium">
                            {battery.id}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin size={15} />
                          {battery.location}
                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <div className="w-28">

                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">
                              Charge
                            </span>

                            <span className="text-white">
                              {battery.soc}%
                            </span>
                          </div>

                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">

                            <div
                              className="h-full rounded-full bg-blue-400"
                              style={{
                                width: `${battery.soc}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={
                            battery.health < 80
                              ? "text-red-400"
                              : "text-green-400"
                          }
                        >
                          {battery.health}%
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={
                            battery.cycles > 2000
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          {battery.cycles}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs border ${statusClasses(
                            battery.status
                          )}`}
                        >
                          {battery.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        {flags.length === 0 ? (
                          <span className="text-green-400 text-sm">
                            Healthy
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1">

                            {flags.map((flag) => (
                              <span
                                key={flag}
                                className="text-xs text-yellow-400"
                              >
                                {flag.replaceAll("_", " ")}
                              </span>
                            ))}

                          </div>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
}