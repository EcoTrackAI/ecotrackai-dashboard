/**
 * Weather utility for fetching current weather from OpenWeather API
 */

/**
 * Fetch current weather data from OpenWeather API
 * @param apiKey - OpenWeather API key
 * @param lat - Latitude (optional, defaults to a location)
 * @param lon - Longitude (optional, defaults to a location)
 */
export async function fetchWeather(
  apiKey: string,
  lat: number = 22.5744, // Default: Kolkata
  lon: number = 88.3629
): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Weather API error:", response.status);
      return null;
    }

    const data: OpenWeatherResponse = await response.json();

    // Map OpenWeather conditions to our app's condition types
    const condition = mapWeatherCondition(data.weather[0]?.main || "Clear");

    return {
      temperature: Math.round(data.main.temp),
      condition,
      location: data.name,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}

/**
 * Map OpenWeather condition to app's WeatherCondition type
 */
function mapWeatherCondition(weatherMain: string): WeatherData["condition"] {
  const condition = weatherMain.toLowerCase();

  if (condition.includes("clear")) return "sunny";
  if (condition.includes("cloud")) return "cloudy";
  if (condition.includes("rain") || condition.includes("drizzle"))
    return "rainy";
  if (condition.includes("snow")) return "snowy";

  return "partly-cloudy";
}
