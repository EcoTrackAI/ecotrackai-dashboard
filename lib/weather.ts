export async function fetchWeather(apiKey: string, lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data: OpenWeatherResponse = await response.json();
    const condition = mapWeatherCondition(data.weather[0]?.main || "Clear");
    return { temperature: Math.round(data.main.temp), condition, location: data.name };
  } catch (error) {
    return null;
  }
}

function mapWeatherCondition(weatherMain: string): WeatherData["condition"] {
  const condition = weatherMain.toLowerCase();
  if (condition.includes("clear")) return "sunny";
  if (condition.includes("cloud")) return "cloudy";
  if (condition.includes("rain") || condition.includes("drizzle")) return "rainy";
  if (condition.includes("snow")) return "snowy";
  return "partly-cloudy";
}
