import requests
import time
import random

API_URL = "http://localhost:5000/api/sensor"
DEVICE_KEY = "demo_key"

print("Starting Smart Krishi ESP32 Simulator...")
while True:
    payload = {
        "device_key": DEVICE_KEY,
        "n": random.uniform(100, 300),
        "p": random.uniform(10, 40),
        "k": random.uniform(100, 200),
        "ph": random.uniform(5.5, 7.5),
        "moisture": random.uniform(30, 80),
        "temperature": random.uniform(22, 35)
    }
    try:
        response = requests.post(API_URL, json=payload)
        print(f"[{time.strftime('%H:%M:%S')}] Data sent. Server response: {response.status_code}")
        print(f"Payload: {payload}")
    except requests.exceptions.ConnectionError:
        print("Failed to connect to server. Is app.py running?")
        
    time.sleep(10)
