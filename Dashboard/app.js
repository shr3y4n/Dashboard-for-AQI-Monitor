// ================= CONFIG =================
const channelID = "3331394";
const WEATHER_KEY = "0b84bc7f815bff43df6a326ab33dd6a7";
const GEMINI_KEY = "AIzaSyCHTq0bfKmd02x_c_zgSjl7SOnxbz3d_cs";


// ================= FETCH SENSOR DATA =================
async function getData() {
  try {
    let res = await fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?results=2`);
    let data = await res.json();

    console.log("ThingSpeak DATA:", data);

    let last = data.feeds[data.feeds.length - 1];

    let aqi = last.field1 ? parseFloat(last.field1) : 0;
    let pm = last.field2 ? parseFloat(last.field2) : 0;
    let temp = last.field4 ? parseFloat(last.field4) : 0;
    let hum = last.field5 ? parseFloat(last.field5) : 0;

    // ===== UI UPDATE =====
    document.getElementById("aqiValue").innerText = aqi;
    document.getElementById("pm").innerText = pm;
    document.getElementById("temp").innerText = temp + "°C";
    document.getElementById("hum").innerText = hum + "%";

    // ===== AQI STATUS =====
    let status = "GOOD";
    let color = "cyan";

    if (aqi > 100) {
      status = "UNHEALTHY";
      color = "red";
    } else if (aqi > 50) {
      status = "MODERATE";
      color = "orange";
    }

    document.getElementById("status").innerText = status;

    // Animate AQI ring
    document.querySelector(".circle").style.borderColor = color;

    // ===== CALL AI (IMPORTANT) =====
    getAIAdvice(aqi);

  } catch (err) {
    console.log("Data fetch error:", err);
  }
}


// ================= GEMINI AI =================
async function getAIAdvice(aqi) {
  console.log("AI FUNCTION CALLED, AQI =", aqi);

  try {
    let level = "";

    if (aqi <= 50) level = "Good air quality";
    else if (aqi <= 100) level = "Moderate air quality";
    else if (aqi <= 150) level = "Unhealthy for sensitive groups";
    else if (aqi <= 200) level = "Unhealthy air quality";
    else level = "Hazardous air quality";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `AQI is ${aqi} (${level}). Give specific health advice. 
                  
Rules:
- If AQI is good → say safe activities
- If moderate → caution
- If unhealthy → warn user
- If hazardous → strict warning (mask, stay indoors)

Keep it short (1-2 lines).`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", data);

    let advice =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!advice) {
      // fallback based on AQI
      if (aqi <= 50) advice = "Air quality is good. Safe for outdoor activities.";
      else if (aqi <= 100) advice = "Moderate air. Sensitive people should be cautious.";
      else if (aqi <= 150) advice = "Limit outdoor exposure if sensitive.";
      else if (aqi <= 200) advice = "Unhealthy air. Wear a mask and avoid outdoor activity.";
      else advice = "Hazardous air! Stay indoors and use air purification.";
    }

    document.getElementById("ai").innerText = advice;

  } catch (error) {
    console.log("Gemini ERROR:", error);

    document.getElementById("ai").innerText =
      "Unable to fetch AI advice.";
  }
}

// ================= THEME TOGGLE =================
function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}


// ================= AUTO RUN =================
setInterval(getData, 5000);
getData();
