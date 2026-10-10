# 🌱 Smart Krishi

> **An affordable IoT-assisted Soil, Fertilizer & Seed Recommendation System designed for small and medium farmers in India.**

![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-Web_Framework-green?style=flat-square&logo=flask)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightgrey?style=flat-square&logo=sqlite)
![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-black?style=flat-square&logo=three.js)
![IoT](https://img.shields.io/badge/Hardware-ESP32-orange?style=flat-square)

---

## 📖 About The Project

A true RS485 NPK soil sensor costs upwards of Rs. 3000 to Rs. 5000, putting it out of reach for many farmers. **Smart Krishi** solves this by offering a highly accessible AgriTech dashboard that works with a **sub-Rs. 1000** custom ESP32 IoT node. 

The system reads live soil moisture, pH, and temperature data, allows manual input for NPK kit tests, and runs the data through a matching algorithm against 20+ native Indian crops to provide exact seed recommendations and precise Urea, DAP, and MOP fertilizer application rates.

### ✨ Key Features
- **📡 IoT Sensor Integration**: Connects seamlessly with ESP32 microcontrollers via a dedicated REST API.
- **🧠 Smart Matching Algorithm**: Compares soil NPK, pH, and Moisture against the ideal baseline conditions for over 20+ crops.
- **⚖️ Precise Fertilizer Calculation**: Automatically calculates the exact kg/acre requirement for Urea, DAP, and MOP based on soil nutrient gaps.
- **🎨 Modern, Accessible UI**: Built with a beautiful glassmorphism design, GSAP animations, Chart.js visualizations, and an interactive Three.js 3D background.
- **📄 Report Generation**: Instantly export beautifully formatted PDF soil health reports.

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask, SQLite (with Werkzeug auth)
- **Frontend:** HTML5, CSS3, Vanilla JS, GSAP (Animations), Three.js (3D Background), Chart.js
- **Hardware (IoT):** ESP32, Arduino IDE, Capacitive Moisture Sensor, Analog pH Module

---

## 🚀 Getting Started

### 1. Software Installation (Web Dashboard)
Make sure you have Python installed, then run the following commands in your terminal:

```bash
# Clone the repository
git clone https://github.com/saniyawagh7-source/Smart-Krishi.git
cd Smart-Krishi

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```
*The app will run at `http://localhost:5000`.*

### 2. Hardware Setup (Rs. 1000 Budget)
To build the IoT node, you will need:
*   ESP32 Development Board (~₹350)
*   Capacitive Soil Moisture Sensor (~₹150)
*   Analog pH Sensor module (~₹300)
*   DS18B20 Temperature Sensor (~₹100)
*   Jumper Wires & Breadboard (~₹100)

Upload the `esp32/smartkrishi_esp32.ino` sketch via the Arduino IDE. Make sure to change your WiFi credentials and the local IP address of your Flask server in the code!

### 3. Testing Without Hardware
Don't have an ESP32 yet? No problem. Open a second terminal and run the included simulator:
```bash
python test_sensor.py
```
This script will act as a virtual IoT device, sending live mock data to your dashboard every 10 seconds so you can test the UI animations.

---

## 🤝 Feedback & Contributions
This project is open-source. Feel free to open issues, submit pull requests, or use the built-in feedback system on the dashboard to help improve the recommendation engine!
