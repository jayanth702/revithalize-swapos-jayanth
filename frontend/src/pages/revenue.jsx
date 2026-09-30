import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  TrendingUp,
  IndianRupee,
  Zap,
  Calculator,
  MapPin,
  Activity,
  Battery,
} from "lucide-react";

import { Link } from "react-router-dom";

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

import { getTransactions } from "../services/api";


const ELECTRICITY_RATE = 6.5;


/*
=========================================================
STATION INFORMATION
=========================================================
*/

const stationInfo = {
  1: {
    name: "Station 01",
    location: "Warangal Central",
  },

  2: {
    name: "Station 02",
    location: "Kazipet",
  },

  3: {
    name: "Station 03",
    location: "Hanamkonda",
  },

  4: {
    name: "Station 04",
    location: "NIT Warangal",
  },

  5: {
    name: "Station 05",
    location: "Subedari",
  },
};


/*
=========================================================
REVENUE PAGE
=========================================================
*/

function Revenue() {

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);


  const [investment, setInvestment] =
    useState(500000);

  const [monthlyProfit, setMonthlyProfit] =
    useState(60000);


  /*
  =======================================================
  FETCH BACKEND TRANSACTIONS
  =======================================================
  */

  useEffect(() => {

    setLoading(true);

    getTransactions()

      .then((data) => {

        console.log(
          "Revenue transactions:",
          data
        );

        setTransactions(
          Array.isArray(data)
            ? data
            : []
        );

        setError(false);

      })

      .catch((err) => {

        console.error(
          "Failed to load revenue data:",
          err
        );

        setError(true);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  /*
  =======================================================
  COMPLETED TRANSACTIONS
  =======================================================
  */

  const completedTransactions =
    useMemo(() => {

      return transactions.filter(
        (transaction) =>
          String(
            transaction.status || ""
          ).toUpperCase() === "COMPLETED"
      );

    }, [transactions]);


  /*
  =======================================================
  TOTAL REVENUE
  =======================================================
  */

  const totalRevenue =
    useMemo(() => {

      return completedTransactions.reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.amount || 0
          ),
        0
      );

    }, [completedTransactions]);


  /*
  =======================================================
  TOTAL SWAPS
  =======================================================
  */

  const totalSwaps =
    completedTransactions.length;


  /*
  =======================================================
  TOTAL ENERGY
  =======================================================
  */

  const totalEnergy =
    useMemo(() => {

      return completedTransactions.reduce(
        (sum, transaction) =>
          sum +
          Number(
            transaction.energy || 0
          ),
        0
      );

    }, [completedTransactions]);


  /*
  =======================================================
  ELECTRICITY COST
  =======================================================
  */

  const electricityCost =
    totalEnergy *
    ELECTRICITY_RATE;


  /*
  =======================================================
  GROSS MARGIN
  =======================================================
  */

  const grossMargin =
    totalRevenue -
    electricityCost;


  /*
  =======================================================
  MARGIN %
  =======================================================
  */

  const marginPercentage =
    totalRevenue > 0
      ? Math.round(
          (grossMargin /
            totalRevenue) *
            100
        )
      : 0;


  /*
  =======================================================
  AVERAGE REVENUE / SWAP
  =======================================================
  */

  const averageRevenuePerSwap =
    totalSwaps > 0
      ? totalRevenue /
        totalSwaps
      : 0;


  /*
  =======================================================
  90-DAY DAILY REVENUE
  =======================================================
  */

  const revenue90Days =
    useMemo(() => {

      const dailyMap = {};

      completedTransactions.forEach(
        (transaction) => {

          const date =
            transaction.date;

          if (!date) return;

          if (!dailyMap[date]) {

            dailyMap[date] = {
              date,
              revenue: 0,
              swaps: 0,
              energy: 0,
            };

          }

          dailyMap[date].revenue +=
            Number(
              transaction.amount || 0
            );

          dailyMap[date].swaps += 1;

          dailyMap[date].energy +=
            Number(
              transaction.energy || 0
            );

        }
      );


      return Object.values(
        dailyMap
      )
        .sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )
        .map((item) => ({

          ...item,

          revenue:
            Math.round(
              item.revenue
            ),

          energy:
            Number(
              item.energy.toFixed(2)
            ),

          label:
            new Date(
              item.date
            ).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
              }
            ),

        }));

    }, [completedTransactions]);


  /*
  =======================================================
  MONTHLY REVENUE
  =======================================================
  */

  const monthlyRevenue =
    useMemo(() => {

      const monthMap = {};

      completedTransactions.forEach(
        (transaction) => {

          if (!transaction.date)
            return;

          const date =
            new Date(
              transaction.date
            );

          const key =
            `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}`;


          if (!monthMap[key]) {

            monthMap[key] = {
              key,
              month:
                date.toLocaleDateString(
                  "en-IN",
                  {
                    month: "short",
                    year: "numeric",
                  }
                ),
              revenue: 0,
              swaps: 0,
              energy: 0,
            };

          }


          monthMap[key].revenue +=
            Number(
              transaction.amount || 0
            );

          monthMap[key].swaps += 1;

          monthMap[key].energy +=
            Number(
              transaction.energy || 0
            );

        }
      );


      return Object.values(
        monthMap
      )
        .sort(
          (a, b) =>
            a.key.localeCompare(
              b.key
            )
        )
        .map((month) => ({

          ...month,

          revenue:
            Math.round(
              month.revenue
            ),

          energy:
            Number(
              month.energy.toFixed(2)
            ),

        }));

    }, [completedTransactions]);


  /*
  =======================================================
  STATION REVENUE
  =======================================================
  */

  const stationRevenue =
    useMemo(() => {

      const stationMap = {};


      completedTransactions.forEach(
        (transaction) => {

          const stationId =
            Number(
              transaction.station_id
            );

          if (!stationInfo[stationId])
            return;


          if (!stationMap[stationId]) {

            stationMap[stationId] = {

              stationId,

              station:
                stationInfo[
                  stationId
                ].name,

              location:
                stationInfo[
                  stationId
                ].location,

              swaps: 0,

              energy: 0,

              revenue: 0,

            };

          }


          stationMap[
            stationId
          ].swaps += 1;


          stationMap[
            stationId
          ].energy +=
            Number(
              transaction.energy || 0
            );


          stationMap[
            stationId
          ].revenue +=
            Number(
              transaction.amount || 0
            );

        }
      );


      return Object.values(
        stationMap
      )
        .sort(
          (a, b) =>
            b.revenue -
            a.revenue
        )
        .map((station) => ({

          ...station,

          energy:
            Number(
              station.energy.toFixed(2)
            ),

          revenue:
            Math.round(
              station.revenue
            ),

        }));

    }, [completedTransactions]);


  /*
  =======================================================
  PAYBACK
  =======================================================
  */

  const paybackMonths =
    monthlyProfit > 0
      ? investment /
        monthlyProfit
      : 0;


  const paybackYears =
    paybackMonths / 12;


  /*
  =======================================================
  LOADING
  =======================================================
  */

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>

          <p className="text-slate-400 mt-4">
            Loading revenue data...
          </p>

        </div>

      </div>

    );

  }


  /*
  =======================================================
  MAIN UI
  =======================================================
  */

  return (

    <div className="min-h-screen bg-slate-950 text-white">


      {/* =================================================
          HEADER
      ================================================= */}

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
              Revenue Dashboard
            </h1>

            <p className="text-sm text-slate-400">
              Network revenue, operating costs and payback analysis
            </p>

          </div>

        </div>

      </header>


      <main className="p-8">


        {/* =================================================
            BACKEND ERROR
        ================================================= */}

        {error && (

          <div className="mb-6 bg-red-950/40 border border-red-800 rounded-xl p-4">

            <h3 className="text-red-400 font-semibold">
              Backend connection failed
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Make sure the FastAPI backend is running on port 8000.
            </p>

          </div>

        )}


        {/* =================================================
            DATA SOURCE
        ================================================= */}

        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">

          <div className="flex items-center gap-3">

            <Activity
              size={18}
              className="text-emerald-400"
            />

            <div>

              <p className="text-sm font-semibold text-emerald-300">
                Live Backend Analytics
              </p>

              <p className="text-xs text-slate-400">
                Calculated from {totalSwaps.toLocaleString("en-IN")} completed transactions in the SwapOS database.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">


          <SummaryCard
            title="90-Day Revenue"
            value={`₹${Math.round(
              totalRevenue
            ).toLocaleString("en-IN")}`}
            icon={<IndianRupee size={22} />}
            color="text-emerald-400"
          />


          <SummaryCard
            title="Energy Consumed"
            value={`${totalEnergy.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 2,
              }
            )} kWh`}
            icon={<Zap size={22} />}
            color="text-blue-400"
          />


          <SummaryCard
            title="Electricity Cost"
            value={`₹${Math.round(
              electricityCost
            ).toLocaleString("en-IN")}`}
            icon={<Zap size={22} />}
            color="text-yellow-400"
          />


          <SummaryCard
            title="Gross Margin"
            value={`${marginPercentage}%`}
            icon={<TrendingUp size={22} />}
            color="text-purple-400"
          />

        </div>


        {/* =================================================
            REVENUE TREND
        ================================================= */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              90-Day Revenue Trend
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Daily revenue calculated from backend transactions
            </p>

          </div>


          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={revenue90Days}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                />

                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  interval={
                    revenue90Days.length > 30
                      ? 6
                      : 0
                  }
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                  contentStyle={{
                    backgroundColor:
                      "#0f172a",
                    border:
                      "1px solid #334155",
                    borderRadius:
                      "8px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* =================================================
            MONTHLY REVENUE + ECONOMICS
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


          {/* MONTHLY */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold">
              Monthly Revenue
            </h2>

            <p className="text-sm text-slate-400 mt-1 mb-6">
              Revenue generated by month
            </p>


            <div className="h-72">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={monthlyRevenue}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                  />

                  <YAxis
                    stroke="#94a3b8"
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(
                        value
                      ).toLocaleString(
                        "en-IN"
                      )}`
                    }
                    contentStyle={{
                      backgroundColor:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "8px",
                    }}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="#a78bfa"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* ECONOMICS */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold">
              Operating Economics
            </h2>

            <p className="text-sm text-slate-400 mt-1 mb-6">
              Electricity cost and network margin
            </p>


            <div className="space-y-5">


              <EconomicsRow
                label="Total Revenue"
                value={`₹${Math.round(
                  totalRevenue
                ).toLocaleString(
                  "en-IN"
                )}`}
                icon={
                  <IndianRupee
                    size={18}
                  />
                }
              />


              <EconomicsRow
                label={`Electricity @ ₹${ELECTRICITY_RATE}/kWh`}
                value={`₹${Math.round(
                  electricityCost
                ).toLocaleString(
                  "en-IN"
                )}`}
                icon={
                  <Zap size={18} />
                }
              />


              <div className="border-t border-slate-800 pt-5">

                <EconomicsRow
                  label="Gross Margin"
                  value={`₹${Math.round(
                    grossMargin
                  ).toLocaleString(
                    "en-IN"
                  )}`}
                  icon={
                    <TrendingUp
                      size={18}
                    />
                  }
                  highlight
                />

              </div>


              <div className="bg-slate-950 rounded-xl p-4">

                <p className="text-xs text-slate-500">
                  Gross Margin Percentage
                </p>

                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {marginPercentage}%
                </p>

              </div>


              <div className="bg-slate-950 rounded-xl p-4">

                <p className="text-xs text-slate-500">
                  Average Revenue / Swap
                </p>

                <p className="text-xl font-bold mt-1">
                  ₹
                  {averageRevenuePerSwap.toFixed(
                    2
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            STATION REVENUE
        ================================================= */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              Station Revenue
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Revenue contribution by station
            </p>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b border-slate-800 text-slate-500">

                  <th className="text-left py-3 px-3">
                    Station
                  </th>

                  <th className="text-left py-3 px-3">
                    Location
                  </th>

                  <th className="text-left py-3 px-3">
                    Swaps
                  </th>

                  <th className="text-left py-3 px-3">
                    Energy
                  </th>

                  <th className="text-left py-3 px-3">
                    Electricity Cost
                  </th>

                  <th className="text-right py-3 px-3">
                    Revenue
                  </th>

                </tr>

              </thead>


              <tbody>

                {stationRevenue.map(
                  (station) => {

                    const cost =
                      station.energy *
                      ELECTRICITY_RATE;


                    return (

                      <tr
                        key={
                          station.stationId
                        }
                        className="border-b border-slate-800/60 hover:bg-slate-800/40"
                      >

                        <td className="py-4 px-3">

                          <div className="flex items-center gap-2">

                            <MapPin
                              size={16}
                              className="text-blue-400"
                            />

                            <span className="font-semibold">
                              {
                                station.station
                              }
                            </span>

                          </div>

                        </td>


                        <td className="py-4 px-3 text-slate-400">
                          {
                            station.location
                          }
                        </td>


                        <td className="py-4 px-3">
                          {station.swaps.toLocaleString(
                            "en-IN"
                          )}
                        </td>


                        <td className="py-4 px-3">
                          {station.energy.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          kWh
                        </td>


                        <td className="py-4 px-3 text-yellow-400">

                          ₹
                          {Math.round(
                            cost
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>


                        <td className="py-4 px-3 text-right font-semibold text-emerald-400">

                          ₹
                          {station.revenue.toLocaleString(
                            "en-IN"
                          )}

                        </td>

                      </tr>

                    );

                  }
                )}


                {stationRevenue.length ===
                  0 && (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-slate-500"
                    >
                      No station revenue data available.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            PAYBACK CALCULATOR
        ================================================= */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-xl bg-purple-500/10">

              <Calculator
                size={24}
                className="text-purple-400"
              />

            </div>


            <div>

              <h2 className="text-xl font-semibold">
                Payback Calculator
              </h2>

              <p className="text-sm text-slate-400">
                Estimate how long it takes to recover the investment
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


            {/* INVESTMENT */}

            <div>

              <label className="text-sm text-slate-400">
                Initial Investment
              </label>

              <div className="relative mt-2">

                <IndianRupee
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="number"
                  value={investment}
                  onChange={(e) =>
                    setInvestment(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500"
                />

              </div>

            </div>


            {/* PROFIT */}

            <div>

              <label className="text-sm text-slate-400">
                Monthly Net Profit
              </label>

              <div className="relative mt-2">

                <IndianRupee
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="number"
                  value={monthlyProfit}
                  onChange={(e) =>
                    setMonthlyProfit(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500"
                />

              </div>

            </div>


            {/* RESULT */}

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">

              <p className="text-sm text-slate-400">
                Estimated Payback
              </p>

              <p className="text-3xl font-bold text-purple-400 mt-1">

                {paybackMonths.toFixed(
                  1
                )}{" "}
                months

              </p>

              <p className="text-sm text-slate-500 mt-1">

                Approximately{" "}
                {paybackYears.toFixed(
                  1
                )}{" "}
                years

              </p>

            </div>

          </div>


          {/* FORMULA */}

          <div className="mt-6 bg-slate-950 rounded-xl p-4">

            <p className="text-xs text-slate-500">
              Payback formula
            </p>

            <p className="text-sm text-slate-300 mt-1">

              Payback Period =
              Initial Investment ÷
              Monthly Net Profit

            </p>

          </div>

        </div>


        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">

          <div className="flex gap-4">

            <Activity
              size={22}
              className="text-emerald-400 mt-1"
            />


            <div>

              <h3 className="font-semibold text-emerald-300">
                Financial Intelligence
              </h3>

              <p className="text-sm text-slate-400 mt-1">

                Electricity cost is calculated using the configured Telangana tariff of ₹6.5 per kWh. Revenue, energy and station-level figures are calculated from the SwapOS backend transaction database.

              </p>

            </div>

          </div>

        </div>


      </main>

    </div>

  );
}


/*
=========================================================
SUMMARY CARD
=========================================================
*/

function SummaryCard({
  title,
  value,
  icon,
  color,
}) {

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p
            className={`text-2xl font-bold mt-2 ${color}`}
          >
            {value}
          </p>

        </div>


        <div className="p-3 rounded-xl bg-slate-800">

          {icon}

        </div>

      </div>

    </div>

  );

}


/*
=========================================================
ECONOMICS ROW
=========================================================
*/

function EconomicsRow({
  label,
  value,
  icon,
  highlight,
}) {

  return (

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="p-2 rounded-lg bg-slate-800">

          {icon}

        </div>

        <span className="text-sm text-slate-400">
          {label}
        </span>

      </div>


      <span
        className={`font-semibold ${
          highlight
            ? "text-emerald-400 text-lg"
            : ""
        }`}
      >
        {value}
      </span>

    </div>

  );

}


export default Revenue;