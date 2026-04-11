#include <WiFiS3.h>
#include <DHT.h>

// ================= WIFI =================
char ssid[] = "Galaxy M122E8A";
char pass[] = "iddz7556";

// ================= THINGSPEAK =================
String apiKey = "IFB4XYZY61PJ07IT";
const char* server = "api.thingspeak.com";

// ================= DHT =================
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// ================= LED =================
#define GREEN_LED 9
#define YELLOW_LED 10
#define RED_LED 11

WiFiClient client;

// ================= VARIABLES =================
float pm25 = 0, pm10 = 0;
int gas = 0;
float temp = 0, hum = 0;
int aqi = 0;

void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);   // SDS011
  dht.begin();

  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  // WiFi connect
  Serial.print("Connecting...");
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nConnected!");
}

void loop() {

  // ================= SDS011 READ =================
  if (Serial1.available() >= 10) {
    byte data[10];
    Serial1.readBytes(data, 10);

    if (data[0] == 0xAA && data[1] == 0xC0) {
      pm25 = (data[2] + data[3]*256) / 10.0;
      pm10 = (data[4] + data[5]*256) / 10.0;
    }
  }

  // ================= OTHER SENSORS =================
  gas = analogRead(A0);
  temp = dht.readTemperature();
  hum = dht.readHumidity();

  // ================= SAFETY FIXES =================
  if (pm25 <= 0) pm25 = 10;     // prevent zero issue
  if (isnan(temp)) temp = 25;
  if (isnan(hum)) hum = 50;

  // ================= AQI CALCULATION =================
  if (pm25 <= 50) aqi = 50;
  else if (pm25 <= 100) aqi = 100;
  else if (pm25 <= 200) aqi = 150;
  else aqi = 200;

  // ================= LED =================
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);

  if (aqi == 50) digitalWrite(GREEN_LED, HIGH);
  else if (aqi == 100) digitalWrite(YELLOW_LED, HIGH);
  else digitalWrite(RED_LED, HIGH);

  // ================= DEBUG PRINT =================
  Serial.print("FINAL DATA → ");
  Serial.print("PM2.5: "); Serial.print(pm25);
  Serial.print("  AQI: "); Serial.print(aqi);
  Serial.print("  Temp: "); Serial.print(temp);
  Serial.print("  Hum: "); Serial.println(hum);

  // ================= SEND TO THINGSPEAK =================
  if (client.connect(server, 80)) {

    String url = "/update?api_key=" + apiKey +
                 "&field1=" + String(aqi) +
                 "&field2=" + String(pm25) +
                 "&field3=" + String(gas) +
                 "&field4=" + String(temp) +
                 "&field5=" + String(hum);

    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: api.thingspeak.com\r\n" +
                 "Connection: close\r\n\r\n");

    Serial.println("Data sent!");
  } else {
    Serial.println("Connection failed");
  }

  // ================= DELAY =================
  delay(15000);  // IMPORTANT for ThingSpeak
}