const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getDashboard() {
  const response = await fetch(`${API_URL}/api/dashboard`);

  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }

  return response.json();
}

export async function getStations() {
  const response = await fetch(`${API_URL}/api/stations`);

  if (!response.ok) {
    throw new Error("Failed to load stations");
  }

  return response.json();
}

export async function getBatteries() {
  const response = await fetch(`${API_URL}/api/batteries`);

  if (!response.ok) {
    throw new Error("Failed to load batteries");
  }

  return response.json();
}

export async function getRiders() {
  const response = await fetch(`${API_URL}/api/riders`);

  if (!response.ok) {
    throw new Error("Failed to load riders");
  }

  return response.json();
}

export async function getTransactions() {
  const response = await fetch(`${API_URL}/api/transactions`);

  if (!response.ok) {
    throw new Error("Failed to load transactions");
  }

  return response.json();
}