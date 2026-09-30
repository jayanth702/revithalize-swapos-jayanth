# SwapOS – Battery Swap Network Operating System

SwapOS is a full-stack battery swap network operations platform designed to help operators monitor battery-swapping stations, battery availability, riders, transactions, revenue, energy consumption and restocking requirements.

The project demonstrates how an EV battery-swapping network can be managed through a centralized operator dashboard.

---

## 🚀 Project Overview

SwapOS provides an operator-focused dashboard for managing a battery swap network.

The system includes:

- Station monitoring
- Battery fleet management
- Rider management
- Transaction monitoring
- Revenue analytics
- Energy consumption analysis
- Electricity cost calculation
- Gross margin analysis
- Restock intelligence
- 90-day historical transaction analytics
- Payback calculation

---

## 🎯 Project Objective

The objective of SwapOS is to provide a centralized operating system for battery-swapping networks.

The platform helps operators answer questions such as:

- Which stations need battery restocking?
- How many charged batteries are available?
- Which batteries require maintenance?
- How much revenue is generated?
- How much electricity is consumed?
- What is the electricity operating cost?
- What is the estimated gross margin?
- Which stations generate the most revenue?
- How long could it take to recover an initial investment?

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │       SwapOS UI         │
                    │   React + Tailwind      │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend    │
                    │        Python           │
                    └────────────┬────────────┘
                                 │
                                 │ SQL
                                 ▼
                    ┌─────────────────────────┐
                    │      SQLite Database    │
                    │        swapos.db        │
                    └─────────────────────────┘