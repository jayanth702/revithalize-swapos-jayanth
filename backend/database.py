import sqlite3


DATABASE_NAME = "swapos.db"


def get_connection():
    connection = sqlite3.connect(
        DATABASE_NAME,
        check_same_thread=False
    )

    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():

    connection = get_connection()

    cursor = connection.cursor()


    # ==========================================
    # STATIONS
    # ==========================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            status TEXT NOT NULL
        )
    """)


    # ==========================================
    # BATTERIES
    # ==========================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS batteries (
            id TEXT PRIMARY KEY,
            location TEXT NOT NULL,
            soc INTEGER,
            health INTEGER,
            cycles INTEGER,
            status TEXT,
            deep_discharge INTEGER
        )
    """)


    # ==========================================
    # RIDERS
    # ==========================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS riders (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            rfid TEXT,
            vehicle TEXT,
            vehicle_type TEXT,
            wallet REAL,
            total_swaps INTEGER,
            average_soc REAL,
            last_swap TEXT,
            status TEXT
        )
    """)


    # ==========================================
    # TRANSACTIONS
    # ==========================================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            station_id INTEGER,
            rider TEXT,
            battery TEXT,
            date TEXT,
            time TEXT,
            amount REAL,
            energy REAL,
            status TEXT
        )
    """)


    connection.commit()

    connection.close()


if __name__ == "__main__":
    initialize_database()

    print("SwapOS SQLite database initialized.")