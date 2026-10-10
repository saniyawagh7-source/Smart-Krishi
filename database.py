import sqlite3
import os
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = 'smart_krishi.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT UNIQUE NOT NULL,
        location TEXT,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    # Soil Tests table
    c.execute('''CREATE TABLE IF NOT EXISTS soil_tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        n REAL, p REAL, k REAL, ph REAL, moisture REAL, temperature REAL,
        source TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    # Recommendations table
    c.execute('''CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id INTEGER,
        crop TEXT,
        match_percent REAL,
        seed_info TEXT,
        fertilizer_json TEXT,
        FOREIGN KEY(test_id) REFERENCES soil_tests(id)
    )''')
    # Feedback table
    c.execute('''CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id INTEGER,
        user_id INTEGER,
        rating INTEGER,
        useful TEXT,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(test_id) REFERENCES soil_tests(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    # Sensor Readings table (temporary store for latest IoT reading)
    c.execute('''CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_key TEXT,
        n REAL, p REAL, k REAL, ph REAL, moisture REAL, temperature REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Seed demo user
    c.execute("SELECT * FROM users WHERE contact='demo@smartkrishi.in'")
    if not c.fetchone():
        c.execute("INSERT INTO users (name, contact, location, password_hash) VALUES (?, ?, ?, ?)",
                  ("Demo Farmer", "demo@smartkrishi.in", "Pune, Maharashtra", generate_password_hash("demo123")))
    
    conn.commit()
    conn.close()

def create_user(name, contact, location, password):
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, contact, location, password_hash) VALUES (?, ?, ?, ?)",
                  (name, contact, location, generate_password_hash(password)))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def verify_user(contact, password):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE contact=?", (contact,))
    user = c.fetchone()
    conn.close()
    if user and check_password_hash(user['password_hash'], password):
        return dict(user)
    return None
