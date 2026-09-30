// Mock swap transaction data
// 50 transactions per station

const riders = [
  "Rider 001",
  "Rider 002",
  "Rider 003",
  "Rider 004",
  "Rider 005",
  "Rider 006",
  "Rider 007",
  "Rider 008",
  "Rider 009",
  "Rider 010",
];

const batteries = [
  "BAT-1001",
  "BAT-1002",
  "BAT-1003",
  "BAT-1004",
  "BAT-1005",
  "BAT-1006",
  "BAT-1007",
  "BAT-1008",
  "BAT-1009",
  "BAT-1010",
];

function createTransactions(stationId) {
  const transactions = [];

  for (let i = 0; i < 50; i++) {
    const transactionNumber = i + 1;

    const day = String((i % 9) + 1).padStart(2, "0");

    const hour = String(8 + (i % 11)).padStart(2, "0");

    const minute = String((i * 7) % 60).padStart(2, "0");

    const amount = 60 + ((i * 13) % 41);

    transactions.push({
      id: `TXN-${stationId}-${String(transactionNumber).padStart(3, "0")}`,

      rider:
        riders[(i + stationId) % riders.length],

      battery:
        batteries[(i + stationId) % batteries.length],

      date: `2026-09-${day}`,

      time: `${hour}:${minute}`,

      amount,

      energy: Number(
        (amount / 12.5).toFixed(2)
      ),

      status: "COMPLETED",
    });
  }

  return transactions.reverse();
}

export const transactionsByStation = {
  1: createTransactions(1),
  2: createTransactions(2),
  3: createTransactions(3),
  4: createTransactions(4),
  5: createTransactions(5),
};