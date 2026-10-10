#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- WiFi Credentials ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// --- Server Details ---
const char* serverUrl = "http://192.168.1.100:5000/api/sensor"; // CHANGE THIS IP TO YOUR LAPTOP IP
const char* deviceKey = "demo_key";

// --- Sensor Pins (ESP32) ---
#define MOISTURE_PIN 34
#define PH_PIN 35
#define TEMP_PIN 32 

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected.");
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Read analog values
    int moistureRaw = analogRead(MOISTURE_PIN);
    int phRaw = analogRead(PH_PIN);
    
    // -------------------------------------------------------------
    // CALIBRATION LOGIC
    // Moisture: map analog value (0-4095) to percentage (0-100)
    // Note: Capacitive sensors read lower values when wet. Adjust thresholds.
    float moisturePercent = map(moistureRaw, 4095, 1200, 0, 100);
    if(moisturePercent < 0) moisturePercent = 0;
    if(moisturePercent > 100) moisturePercent = 100;
    
    // pH Calculation (Standard analog module conversion)
    // 3.3V reference on ESP32, replace '5.0' with '3.3' depending on module
    float voltage = phRaw * (3.3 / 4095.0);
    float phValue = 3.5 * voltage; 
    
    // Temperature (Mocking here, implement DS18B20 library if needed)
    float temperature = 25.5;
    
    // N, P, K (Without RS485 module, we send mock/null. Replace if you have the module)
    float nValue = 150.0;
    float pValue = 30.0;
    float kValue = 120.0;
    // -------------------------------------------------------------

    // Build JSON payload
    StaticJsonDocument<200> doc;
    doc["device_key"] = deviceKey;
    doc["n"] = nValue;
    doc["p"] = pValue;
    doc["k"] = kValue;
    doc["ph"] = phValue;
    doc["moisture"] = moisturePercent;
    doc["temperature"] = temperature;

    String requestBody;
    serializeJson(doc, requestBody);
    
    Serial.print("Sending POST: ");
    Serial.println(requestBody);

    int httpResponseCode = http.POST(requestBody);
    
    if(httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("Error in WiFi connection");
  }
  
  delay(10000); // Send data every 10 seconds
}
