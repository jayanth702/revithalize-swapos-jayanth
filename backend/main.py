from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import (
    get_connection,
    initialize_database,
)


app = FastAPI(
    title="SwapOS API",
    description="Battery Swap Network Operating System API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
   allow_origins=["*"],
allow_credentials=False,
allow_methods=["*"],
allow_headers=["*"],
)


# ==========================================
# DATABASE
# ==========================================

initialize_database()


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():

    return {
        "message": "SwapOS API is running",
        "version": "1.0.0",
        "status": "online"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "service": "SwapOS Backend"
    }


# ==========================================
# STATIONS
# ==========================================

@app.get("/api/stations")
def get_stations():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM stations
        ORDER BY id
    """)

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ==========================================
# BATTERIES
# ==========================================

@app.get("/api/batteries")
def get_batteries():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM batteries
        ORDER BY id
    """)

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ==========================================
# RIDERS
# ==========================================

@app.get("/api/riders")
def get_riders():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM riders
        ORDER BY id
    """)

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ==========================================
# TRANSACTIONS
# ==========================================

@app.get("/api/transactions")
def get_transactions():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
    SELECT *
    FROM transactions
    ORDER BY date DESC, time DESC
""")

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ==========================================
# DASHBOARD SUMMARY
# ==========================================

@app.get("/api/dashboard")
def dashboard():

    connection = get_connection()

    cursor = connection.cursor()


    cursor.execute("""
        SELECT COUNT(*) AS total_batteries
        FROM batteries
    """)

    total_batteries = cursor.fetchone()["total_batteries"]


    cursor.execute("""
        SELECT COUNT(*) AS active_riders
        FROM riders
        WHERE status = 'ACTIVE'
    """)

    active_riders = cursor.fetchone()["active_riders"]


    cursor.execute("""
        SELECT COUNT(*) AS total_transactions
        FROM transactions
    """)

    total_transactions = cursor.fetchone()["total_transactions"]


    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) AS revenue
        FROM transactions
    """)

    revenue = cursor.fetchone()["revenue"]


    connection.close()


    return {
        "total_batteries": total_batteries,
        "active_riders": active_riders,
        "total_transactions": total_transactions,
        "revenue": revenue,
    }