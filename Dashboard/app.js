// ================= CONFIG =================
const channelID = "3331394";
const WEATHER_KEY = "93d8931bfd04556d9950e0cd87119237";
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
                  text: `AQI is ${aqi}. Give one short health advice.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", data);

    let advice = "";

    if (data.candidates && data.candidates.length > 0) {
      advice = data.candidates[0].content.parts[0].text;
    } else {
      advice = "No AI response";
    }

    document.getElementById("ai").innerText = advice;

  } catch (error) {
    console.log("Gemini ERROR:", error);
    document.getElementById("ai").innerText = "AI failed";
  }
}


// ================= SEARCH (WEATHER) =================
document.getElementById("search").addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    let city = e.target.value;

    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
      );

      let data = await res.json();

      console.log("WEATHER DATA:", data);

      if (data.cod === 200) {
        document.getElementById("weather").innerText =
          `${data.main.temp}°C, ${data.weather[0].main}`;
      } else {
        document.getElementById("weather").innerText = "City not found";
      }

    } catch (err) {
      console.log("Weather error:", err);
    }
  }
});


// ================= THEME TOGGLE =================
function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}


// ================= AUTO RUN =================
setInterval(getData, 5000);
getData();
