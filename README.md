# 🔋 SwapOS – Battery Swap Network Operating System

> A full-stack operations platform for managing battery-swapping stations, battery fleets, riders, revenue, restocking intelligence, and network performance.

🌐 **Live Demo:** https://revithalize-swapos-jayanth.vercel.app  
💻 **GitHub:** https://github.com/jayanth702/revithalize-swapos-jayanth

## 🚀 Overview

SwapOS is a Battery Swap Network Operating System designed to help operators monitor and manage a distributed battery-swapping network from a single dashboard.

## 🎯 Key Features

- 🏪 Station Management
- 🔋 Battery Fleet Management
- 👥 Rider Management
- 📦 Restock Intelligence
- 📈 Revenue Dashboard
- ⚡ Electricity Cost Analysis
- 💰 Gross Margin Calculation
- 📊 90-Day Historical Analytics
- 💵 Payback Calculator
- 📍 Station-Level Monitoring

## 🏪 Network

| Metric | Value |
|---|---:|
| Stations | 5 |
| Slots | 30 |
| Battery Records | 24 |
| Riders | 10 |
| Historical Transactions | ~3,600 |
| Historical Period | 90 Days |
| Electricity Tariff | ₹6.50/kWh |

### Stations

- Station 01 — Warangal Central
- Station 02 — Kazipet
- Station 03 — Hanamkonda
- Station 04 — NIT Warangal
- Station 05 — Subedari

## 📈 Financial Analytics

### Mock Network Metrics

| Metric | Value |
|---|---:|
| Revenue | ₹277,200 |
| Electricity Cost | ₹144,144 |
| Gross Margin | ₹133,056 |
| Gross Margin % | ~48% |

### Electricity Cost

```text
Electricity Cost = Energy Consumption × ₹6.50/kWh



🏗️ Architecture
React + Tailwind
       ↓
    REST API
       ↓
FastAPI Backend
       ↓
   SQLite DB

   🔌 API Endpoints
GET /
GET /api/health
GET /api/stations
GET /api/batteries
GET /api/riders
GET /api/transactions
GET /api/dashboard



📁 Project Structure
revithalize-swapos-jayanth/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── data/
│   │   ├── pages/
│   │   └── services/
│   └── vercel.json
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── seed.py
│   ├── requirements.txt
│   └── swapos.db
│
└── README.md

💻 Local Setup
Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
cd frontend
npm install
npm run dev


👨‍💻 Developer

M. Jayanth
B.Tech – CSE (Artificial Intelligence & Machine Learning)
SR University

Skills

Java • Python • C • SQL • JavaScript • React • FastAPI • AI/ML • Git • GitHub

📌 Disclaimer

This project uses mock/demo operational data for development, demonstration, and evaluation purpose
