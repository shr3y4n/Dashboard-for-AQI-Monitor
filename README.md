 🌍 AI-Powered Smart AQI & Health Monitoring System

🚀 Overview

Air pollution is a major global health concern, yet most people lack access to **real-time, localized air quality data** and actionable insights.

This project presents an **AI-powered IoT-based Air Quality Monitoring System** that:

* Measures environmental parameters in real time
* Calculates AQI using particulate matter data
* Displays data on a modern web dashboard
* Provides **AI-generated health recommendations**

---

## 🎯 Problem Statement

Existing air quality systems:

* Are centralized and not location-specific
* Do not provide real-time personal insights
* Lack actionable recommendations

👉 Our solution bridges this gap using **IoT + Cloud + AI**

---

## 🧠 Features

✔ Real-time AQI monitoring
✔ PM2.5 measurement using laser sensor
✔ Temperature & humidity tracking
✔ Gas detection (air quality trends)
✔ AI-powered health advice (Gemini API)
✔ Interactive web dashboard
✔ Weather integration
✔ Dark/Light mode UI
✔ LED indicators for quick visual feedback

## 🏗️ System Architecture

```text
Sensors → Arduino → ThingSpeak (Cloud) → Web Dashboard → AI (Gemini)
```

---

## 🔧 Hardware Components

### 🌫️ SDS011 Dust Sensor

* Measures PM2.5 and PM10
* Uses laser scattering principle
* Core sensor for AQI calculation

---

### 🌡️ DHT11 Sensor

* Measures temperature and humidity
* Provides environmental context

---

### ☣️ MQ-135 Gas Sensor

* Detects gases like CO₂, NH₃, smoke, benzene
* Used for overall air quality indication

---

### 💡 LEDs

* Green → Good
* Yellow → Moderate
* Red → Unhealthy

---

### 🧠 Microcontroller

* Arduino (with WiFi capability)
* Handles data processing and transmission

---

## 💻 Software Stack

* **Frontend:** HTML, CSS, JavaScript
* **Cloud:** ThingSpeak
* **AI:** Gemini API
* **APIs:** OpenWeather API

---

## ⚙️ Working

1. Sensors collect environmental data
2. Arduino processes values
3. AQI is calculated using PM2.5
4. Data is uploaded to ThingSpeak
5. Web app fetches real-time data
6. Dashboard updates dynamically
7. Gemini AI generates health advice

---

## 🤖 AI Integration

The system uses **Gemini AI** to convert AQI values into **human-readable health advice**.

Example:

* Low AQI → Safe outdoor activity
* High AQI → Avoid exposure, wear mask

---

## 📊 AQI Classification

| AQI Range | Status                |
| --------- | --------------------- |
| 0–50      | Good                  |
| 51–100    | Moderate              |
| 101–150   | Unhealthy (Sensitive) |
| 151–200   | Unhealthy             |
| 200+      | Hazardous             |

---

## 🌐 Web Dashboard Features

* Live AQI display
* Animated UI
* Weather search
* AI advisory section
* Responsive design
* Real-time updates

---



### 🔧 Hardware Setup

1. Connect SDS011, DHT11, MQ135 to Arduino
2. Upload Arduino code
3. Ensure WiFi connection


## 📈 Future Scope

* Mobile app integration
* Real-time alerts/notifications
* Predictive AQI analysis
* GPS-based pollution mapping
* Smart city deployment

---

## 🏆 Innovation

* Combines **IoT + AI + Web** in one system
* Provides **actionable insights**, not just data
* Low-cost and scalable solution

---

## 📌 Conclusion

This project transforms raw environmental data into meaningful insights using AI, making air quality monitoring more accessible, intelligent, and impactful.

---

## 🙌 Contributors

* Shreyan Dey

---

## 📜 License

This project is for educational and research purposes.



---

If you want, I can:
👉 Convert this into a **Devpost submission (very important)**
👉 Add badges + images + diagrams

Just say 👍
