from database import (
    get_connection,
    initialize_database,
)


initialize_database()

connection = get_connection()

cursor = connection.cursor()


# ==========================================
# STATIONS
# ==========================================

stations = [

    (
        1,
        "Station 01",
        "Warangal Central",
        18.0005,
        79.5888,
        "ACTIVE",
    ),

    (
        2,
        "Station 02",
        "Kazipet",
        17.9689,
        79.5028,
        "ACTIVE",
    ),

    (
        3,
        "Station 03",
        "Hanamkonda",
        17.9784,
        79.5941,
        "ACTIVE",
    ),

    (
        4,
        "Station 04",
        "NIT Warangal",
        17.9826,
        79.5309,
        "ACTIVE",
    ),

    (
        5,
        "Station 05",
        "Subedari",
        18.0045,
        79.5668,
        "ACTIVE",
    ),

]


cursor.executemany(
    """
    INSERT OR REPLACE INTO stations
    (id, name, location, latitude, longitude, status)
    VALUES (?, ?, ?, ?, ?, ?)
    """,
    stations
)


# ==========================================
# BATTERIES
# ==========================================

batteries = [

    ("BAT-1001", "Station 01", 96, 89, 1637, "CHARGED", 0),
    ("BAT-1002", "Station 01", 60, 92, 1774, "CHARGED", 0),
    ("BAT-1003", "Station 01", 67, 91, 1911, "CHARGING", 0),
    ("BAT-1004", "Station 01", 94, 87, 1420, "CHARGED", 0),
    ("BAT-1005", "Station 01", 88, 84, 1850, "CHARGED", 0),
    ("BAT-1006", "Station 01", 91, 90, 1325, "CHARGED", 0),

    ("BAT-1007", "Station 02", 95, 86, 1980, "CHARGED", 0),
    ("BAT-1009", "Station 02", 71, 88, 1540, "CHARGING", 0),
    ("BAT-1010", "Station 02", 42, 74, 2187, "FAULT", 1),

    ("BAT-1013", "Station 03", 97, 94, 1102, "CHARGED", 0),
    ("BAT-1014", "Station 03", 92, 91, 1280, "CHARGED", 0),
    ("BAT-1015", "Station 03", 89, 87, 1760, "CHARGED", 0),
    ("BAT-1016", "Station 03", 93, 90, 1450, "CHARGED", 0),
    ("BAT-1018", "Station 03", 86, 82, 1945, "CHARGED", 0),

    ("BAT-1019", "Station 04", 90, 85, 1870, "CHARGED", 0),
    ("BAT-1020", "Station 04", 35, 68, 2310, "FAULT", 1),
    ("BAT-1021", "Station 04", 64, 83, 1685, "CHARGING", 0),
    ("BAT-1022", "Station 04", 95, 91, 1240, "CHARGED", 0),
    ("BAT-1023", "Station 04", 93, 88, 1560, "CHARGED", 0),

    ("BAT-1025", "Station 05", 98, 95, 980, "CHARGED", 0),
    ("BAT-1026", "Station 05", 73, 86, 1490, "CHARGING", 0),
    ("BAT-1028", "Station 05", 94, 90, 1370, "CHARGED", 0),
    ("BAT-1029", "Station 05", 91, 81, 1995, "CHARGED", 0),
    ("BAT-1030", "Station 05", 28, 76, 2045, "FAULT", 1),

]


cursor.executemany(
    """
    INSERT OR REPLACE INTO batteries
    (id, location, soc, health, cycles, status, deep_discharge)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """,
    batteries
)


# ==========================================
# RIDERS
# ==========================================

riders = [

    (
        "RIDER-001",
        "Rider 001",
        "RFID-10001",
        "TS08AB1234",
        "Electric Scooter",
        2450,
        48,
        21,
        "2026-09-29 14:32",
        "ACTIVE",
    ),

    (
        "RIDER-002",
        "Rider 002",
        "RFID-10002",
        "TS08CD5678",
        "Electric Scooter",
        1820,
        41,
        18,
        "2026-09-29 13:48",
        "ACTIVE",
    ),

    (
        "RIDER-003",
        "Rider 003",
        "RFID-10003",
        "TS09EF9012",
        "Electric Bike",
        980,
        36,
        24,
        "2026-09-29 12:21",
        "ACTIVE",
    ),

    (
        "RIDER-004",
        "Rider 004",
        "RFID-10004",
        "TS08GH3456",
        "Electric Scooter",
        3210,
        62,
        19,
        "2026-09-29 11:55",
        "ACTIVE",
    ),

    (
        "RIDER-005",
        "Rider 005",
        "RFID-10005",
        "TS10JK7890",
        "Electric Bike",
        1450,
        29,
        27,
        "2026-09-28 18:42",
        "ACTIVE",
    ),

    (
        "RIDER-006",
        "Rider 006",
        "RFID-10006",
        "TS08LM2468",
        "Electric Scooter",
        760,
        53,
        16,
        "2026-09-29 10:18",
        "ACTIVE",
    ),

    (
        "RIDER-007",
        "Rider 007",
        "RFID-10007",
        "TS09NP1357",
        "Electric Scooter",
        2100,
        44,
        22,
        "2026-09-29 09:46",
        "ACTIVE",
    ),

    (
        "RIDER-008",
        "Rider 008",
        "RFID-10008",
        "TS08QR8642",
        "Electric Bike",
        1340,
        31,
        25,
        "2026-09-28 17:32",
        "ACTIVE",
    ),

    (
        "RIDER-009",
        "Rider 009",
        "RFID-10009",
        "TS10ST9753",
        "Electric Scooter",
        2950,
        57,
        17,
        "2026-09-29 08:52",
        "ACTIVE",
    ),

    (
        "RIDER-010",
        "Rider 010",
        "RFID-10010",
        "TS08UV4321",
        "Electric Scooter",
        1120,
        27,
        29,
        "2026-09-27 16:24",
        "INACTIVE",
    ),

]


cursor.executemany(
    """
    INSERT OR REPLACE INTO riders
    (
        id,
        name,
        rfid,
        vehicle,
        vehicle_type,
        wallet,
        total_swaps,
        average_soc,
        last_swap,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    riders
)
# ==========================================
# TRANSACTIONS
# ==========================================
# ==========================================
# TRANSACTIONS - 90 DAYS
# ==========================================

from datetime import date, timedelta


# Clear previous transaction data
cursor.execute("DELETE FROM transactions")


riders_list = [
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
]


# Use only batteries that actually exist
batteries_list = [
    "BAT-1001",
    "BAT-1002",
    "BAT-1003",
    "BAT-1004",
    "BAT-1005",
    "BAT-1006",
    "BAT-1007",
    "BAT-1009",
    "BAT-1010",
    "BAT-1013",
    "BAT-1014",
    "BAT-1015",
    "BAT-1016",
    "BAT-1018",
    "BAT-1019",
    "BAT-1020",
    "BAT-1021",
    "BAT-1022",
    "BAT-1023",
    "BAT-1025",
    "BAT-1026",
    "BAT-1028",
    "BAT-1029",
    "BAT-1030",
]


transactions = []


# --------------------------------------------------
# 90 DAYS
# July 3, 2026 -> September 30, 2026
# --------------------------------------------------

start_date = date(2026, 7, 3)

number_of_days = 90


# --------------------------------------------------
# Generate realistic transactions
# 5 stations
# 8 transactions per station per day
# 90 days
# Total = 3,600 transactions
# --------------------------------------------------

for day_index in range(number_of_days):

    current_date = start_date + timedelta(days=day_index)

    date_string = current_date.strftime("%Y-%m-%d")


    for station_id in range(1, 6):

        for transaction_number in range(1, 9):

            # Different activity pattern for each station
            seed_value = (
                day_index
                + station_id * 7
                + transaction_number * 13
            )


            # Time between 7 AM and 9 PM
            hour = 7 + (seed_value % 15)

            minute = (seed_value * 7) % 60

            time_string = (
                f"{hour:02d}:{minute:02d}"
            )


            # Revenue between approximately ₹60 and ₹110
            amount = 60 + (
                (seed_value * 17) % 51
            )


            # Energy consumed
            # Approximate energy required for each swap
            energy = round(
                amount / 12.5,
                2
            )


            # Rider selection
            rider_index = (
                day_index
                + station_id
                + transaction_number
            ) % len(riders_list)

            rider = riders_list[rider_index]


            # Battery selection
            battery_index = (
                day_index * 3
                + station_id
                + transaction_number
            ) % len(batteries_list)

            battery = batteries_list[battery_index]


            # Unique transaction ID
            transaction_id = (
                f"TXN-{station_id}-"
                f"{current_date.strftime('%m%d')}-"
                f"{transaction_number:02d}"
            )


            transactions.append(
                (
                    transaction_id,
                    station_id,
                    rider,
                    battery,
                    date_string,
                    time_string,
                    amount,
                    energy,
                    "COMPLETED",
                )
            )


# --------------------------------------------------
# Insert transactions
# --------------------------------------------------

cursor.executemany(
    """
    INSERT INTO transactions
    (
        id,
        station_id,
        rider,
        battery,
        date,
        time,
        amount,
        energy,
        status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    transactions
)


# ==========================================
# UPDATE RIDER STATISTICS
# ==========================================

for rider in riders_list:

    cursor.execute(
        """
        SELECT COUNT(*) AS swap_count
        FROM transactions
        WHERE rider = ?
        """,
        (rider,)
    )

    swap_count = cursor.fetchone()["swap_count"]


    cursor.execute(
        """
        UPDATE riders
        SET
            total_swaps = ?,
            last_swap = '2026-09-30 21:00'
        WHERE name = ?
        """,
        (
            swap_count,
            rider,
        )
    )


# ==========================================
# SAVE DATABASE
# ==========================================

connection.commit()

connection.close()


print()
print("==========================================")
print("SwapOS DATABASE SEEDED SUCCESSFULLY")
print("==========================================")
print(f"Transactions inserted: {len(transactions)}")
print("Historical period: 90 days")
print("Start date: 2026-07-03")
print("End date: 2026-09-30")
print("Stations: 5")
print("Transactions per station/day: 8")
print("Total transactions: 3,600")
print("Electricity tariff: ₹6.50 / kWh")
print("==========================================")