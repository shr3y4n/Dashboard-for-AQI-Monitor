const channelID = "3331394";
const WEATHER_KEY = "e35d0f72723218b32dbe1eaff10c142e";
const GEMINI_KEY = "AIzaSyD5Zi5MRNF36Drz9WWsXsWC1weykGKTOGg";

// ================= AQI DATA =================
async function getData() {
  let res = await fetch(`https://api.thingspeak.com/channels/${channelID}/feeds/last.json`);
  let data = await res.json();

  console.log("DATA:", data); // debug

  let aqi = Number(data.field1);
  let pm = Number(data.field2);
  let temp = Number(data.field4);
  let hum = Number(data.field5);

  // UI update
  document.getElementById("aqiValue").innerText = aqi;
  document.getElementById("pm").innerText = pm;
  document.getElementById("temp").innerText = temp + "°C";
  document.getElementById("hum").innerText = hum + "%";

  let status = "GOOD";
  if (aqi > 100) status = "UNHEALTHY";
  else if (aqi > 50) status = "MODERATE";

  document.getElementById("status").innerText = status;
}
}

setInterval(getData, 5000);
getData();

// ================= GEMINI =================
async function getAIAdvice(aqi) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `AQI is ${aqi}. Give short health advice.`
          }]
        }]
      })
    }
  );

  const data = await res.json();
  document.getElementById("ai").innerText =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "No advice";
}

// ================= SEARCH =================
document.getElementById("search").addEventListener("change", async (e) => {
  let city = e.target.value;

  // WEATHER
  let weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
  );

  let weatherData = await weatherRes.json();

  document.getElementById("weather").innerText =
    `${weatherData.main.temp}°C, ${weatherData.weather[0].main}`;

  // GEMINI AQI + SUMMARY
  const aiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Give AQI and environmental summary for ${city}`
          }]
        }]
      })
    }
  );

  const aiData = await aiRes.json();

  document.getElementById("ai").innerText =
    aiData.candidates?.[0]?.content?.parts?.[0]?.text;
});

// ================= THEME =================
function toggleTheme() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}
