import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Battery,
  MapPin,
  ChevronRight,
} from "lucide-react";

import { stations as localStations } from "../data/station";

function getStatusStyle(status) {
  switch (status) {
    case "CHARGED":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        dot: "bg-emerald-500",
      };

    case "CHARGING":
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        dot: "bg-yellow-400",
      };

    case "EMPTY":
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-400",
        dot: "bg-slate-500",
      };

    case "FAULT":
      return {
        bg: "bg-red-500/10",
        text: "text-red-400",
        dot: "bg-red-500",
      };

    default:
      return {
        bg: "bg-slate-500/10",
        text: "text-slate-400",
        dot: "bg-slate-500",
      };
  }
}

function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Connect to FastAPI backend
  useEffect(() => {
    fetch("https://revithalize-swapos-jayanth.onrender.com/api/stations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stations");
        }

        return response.json();
      })
      .then((backendStations) => {
        // Backend currently contains station information.
        // Local data contains the 6-slot mock information.
        const mergedStations = backendStations.map((backendStation) => {
          const localStation = localStations.find(
            (station) => station.id === backendStation.id
          );

          return {
            ...backendStation,
            slots: localStation?.slots || [],
          };
        });

        setStations(mergedStations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Station API error:", err);
        setError("Unable to load stations from backend.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}

      <header className="border-b border-slate-800 px-8 py-5">

        <div className="flex items-center gap-4">

          <Link
            to="/"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              Swap Stations
            </h1>

            <p className="text-sm text-slate-400">
              Monitor all battery swap stations
            </p>
          </div>

        </div>

      </header>


      {/* Content */}

      <main className="p-8">

        {/* Loading */}

        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-slate-400">
              Loading stations from backend...
            </p>
          </div>
        )}


        {/* Error */}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <p className="text-red-400 font-medium">
              {error}
            </p>

            <p className="text-sm text-slate-400 mt-2">
              Make sure the FastAPI backend is running on port 8000.
            </p>
          </div>
        )}


        {/* Station content */}

        {!loading && !error && (

          <>

            <div className="flex justify-between items-center mb-6">

              <div>

                <p className="text-slate-400">
                  Network stations
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {stations.length} stations •{" "}
                  {stations.length * 6} total slots
                </p>

              </div>

            </div>


            {/* Station cards */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {stations.map((station) => {

                const charged = station.slots.filter(
                  (slot) => slot.status === "CHARGED"
                ).length;

                const charging = station.slots.filter(
                  (slot) => slot.status === "CHARGING"
                ).length;

                const empty = station.slots.filter(
                  (slot) => slot.status === "EMPTY"
                ).length;

                const fault = station.slots.filter(
                  (slot) => slot.status === "FAULT"
                ).length;

                const lowAvailability = charged < 2;

                return (

                  <div
                    key={station.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                  >

                    {/* Station header */}

                    <div className="flex justify-between items-start">

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="p-3 rounded-xl bg-emerald-500/10">

                            <Battery
                              className="text-emerald-400"
                              size={22}
                            />

                          </div>


                          <div>

                            <h2 className="text-lg font-semibold">
                              {station.name}
                            </h2>


                            <div className="flex items-center gap-1 text-sm text-slate-400">

                              <MapPin size={14} />

                              {station.location}

                            </div>

                          </div>

                        </div>

                      </div>


                      {lowAvailability && (

                        <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                          Low availability
                        </span>

                      )}

                    </div>


                    {/* Slot summary */}

                    <div className="grid grid-cols-4 gap-2 mt-6">

                      <MiniStatus
                        label="Charged"
                        value={charged}
                        color="text-emerald-400"
                      />

                      <MiniStatus
                        label="Charging"
                        value={charging}
                        color="text-yellow-400"
                      />

                      <MiniStatus
                        label="Empty"
                        value={empty}
                        color="text-slate-400"
                      />

                      <MiniStatus
                        label="Fault"
                        value={fault}
                        color="text-red-400"
                      />

                    </div>


                    {/* 6 slot preview */}

                    <div className="grid grid-cols-6 gap-2 mt-5">

                      {station.slots.map((slot) => {

                        const style = getStatusStyle(
                          slot.status
                        );

                        return (

                          <div
                            key={slot.id}
                            className={`${style.bg} border border-slate-800 rounded-lg p-3 text-center`}
                          >

                            <p className="text-xs text-slate-500">
                              S{slot.number}
                            </p>


                            <div
                              className={`w-2 h-2 ${style.dot} rounded-full mx-auto mt-2`}
                            ></div>

                          </div>

                        );

                      })}

                    </div>


                    {/* Details button */}

                    <Link
                      to={`/stations/${station.id}`}
                      className="mt-5 w-full bg-slate-800 hover:bg-slate-700 rounded-xl py-3 px-4 flex items-center justify-between text-sm"
                    >

                      <span>
                        View station details
                      </span>

                      <ChevronRight size={18} />

                    </Link>

                  </div>

                );

              })}

            </div>

          </>

        )}

      </main>

    </div>
  );
}


function MiniStatus({
  label,
  value,
  color,
}) {

  return (

    <div className="bg-slate-800/60 rounded-lg p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className={`text-xl font-bold mt-1 ${color}`}>
        {value}
      </p>

    </div>

  );

}


export default Stations;