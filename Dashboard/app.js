// ================= CONFIG =================
const channelID = "3331394";
const WEATHER_KEY = "93d8931bfd04556d9950e0cd87119237";
const GEMINI_KEY = "AIzaSyCHTq0bfKmd02x_c_zgSjl7SOnxbz3d_cs";

// ================= FETCH SENSOR DATA =================
async function getData() {
  try {
    let res = await fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?results=2`);
    let data = await res.json();

    console.log("ThingSpeak:", data);

    let last = data.feeds[data.feeds.length - 1];

    let aqi = last.field1 ? parseFloat(last.field1) : 0;
    let pm = last.field2 ? parseFloat(last.field2) : 0;
    let temp = last.field4 ? parseFloat(last.field4) : 0;
    let hum = last.field5 ? parseFloat(last.field5) : 0;

    // UI UPDATE
    document.getElementById("aqiValue").innerText = aqi;
    document.getElementById("pm").innerText = pm;
    document.getElementById("temp").innerText = temp + "°C";
    document.getElementById("hum").innerText = hum + "%";

    // AQI STATUS + COLOR
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

    // Animate circle color
    document.querySelector(".circle").style.borderColor = color;

    // AI Advice
    getAIAdvice(aqi);

  } catch (err) {
    console.log("Error fetching data:", err);
  }
}

// AUTO REFRESH
setInterval(getData, 5000);
getData();


// ================= GEMINI AI =================
console.log("AI FUNCTION CALLED, AQI =", aqi);
async function getAIAdvice(aqi) {
  try {
    const res = await fetch(
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

    const data = await res.json();

    console.log("AI RESPONSE:", data);

    let advice = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    document.getElementById("ai").innerText =
      advice || "No AI response";

  } catch (err) {
    console.log("Gemini error:", err);
    document.getElementById("ai").innerText = "AI error";
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

      if (data.main) {
        document.getElementById("weather").innerText =
          `${data.main.temp}°C, ${data.weather[0].main}`;
      } else {
        document.getElementById("weather").innerText = "City not found";
      }

      // OPTIONAL: AI summary for city
      const aiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Give a short environmental summary for ${city}`
              }]
            }]
          })
        }
      );

      const aiData = await aiRes.json();

      let summary =
        aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No data";

      document.getElementById("ai").innerText = summary;

    } catch (err) {
      console.log("Search error:", err);
    }
  }
});


// ================= THEME TOGGLE =================
function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}
