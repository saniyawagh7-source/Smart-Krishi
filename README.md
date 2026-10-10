# Smart Krishi

Smart Krishi is a low-cost IoT-Assisted Soil, Fertilizer & Seed Recommendation System designed for small and medium farmers in India.

## Features
- **IoT Integration**: Reads data from a custom-built ESP32 sensor node.
- **Crop & Seed Recommendations**: Algorithm matches 20 Indian crops against soil conditions.
- **Fertilizer Planning**: Custom NPK gap calculation and advice.
- **Beautiful UI**: Modern, clean AgriTech aesthetic with GSAP animations, Chart.js, and Three.js 3D backgrounds.

## Hardware Setup (Rs. 1000 Budget)
- ESP32 Development Board (~Rs 350)
- Capacitive Soil Moisture Sensor (~Rs 150)
- Analog pH Sensor module (~Rs 300)
- DS18B20 Temperature Sensor (~Rs 100)
- Jumper Wires & Breadboard (~Rs 100)

*Note: True RS485 NPK sensors cost more. This project estimates N, P, and K, or allows manual entry of test-kit values as a fallback.*

## Installation & Running

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```
   The database is auto-generated on the first run. The app will be available at `http://localhost:5000`.

3. **Demo User:**
   - **Contact**: `demo@smartkrishi.in`
   - **Password**: `demo123`

## Testing IoT without Hardware
Run the included python simulation script in another terminal:
```bash
python test_sensor.py
```
This will send mock JSON data to the backend every 10 seconds.
