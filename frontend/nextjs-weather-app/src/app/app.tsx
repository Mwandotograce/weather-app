"use client";

import { useEffect, useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import { WeatherData } from "./interfaces/weatherdata";
import SearchBar from "./components/SearchBar";
import ForecastWeather from "./components/ForecastWeather";
import WindStatus from "./components/WindStatus";
import HumidityStatus from "./components/HumidityStatus";

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<string>("C");
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("London");

  const fetchWeatherData = async (cityInput: string) => {
    try {
      console.log(`Fetching weather data for ${cityInput}...`);
      const response = await fetch(`http://localhost:8000/api/weather/combinedweatherdata?city=${encodeURIComponent(cityInput)}&units=metric`);
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("API response:", result);
      if (result.success) {
        setWeatherData({
          city: result.data.current.city,
          country: result.data.current.country,
          currentWeather: {
            temperature: result.data.current.temperature,
            icon: result.data.current.icon,
            summary: result.data.current.weather_summary,
            description: result.data.current.description,
            windSpeed: result.data.current.wind_speed,
            windDirection: result.data.current.wind_direction,
            humidity: result.data.current.humidity,
          },
          forecastData: result.data.forecast.map((item: any) => ({
            date: item.date,
            temperature: item.temperature,
            temp_min: item.temp_min,
            temp_max: item.temp_max,
            description: item.description,
            summary: item.weather_summary,
            icon: item.icon,
            humidity: item.humidity,
            windSpeed: item.wind_speed,
            windDirection: item.wind_direction,
          })),
        });
        setError(null);
      } else {
        setError(`API error: ${result.message}`);
        console.error("API error:", result.message);
      }
    } catch (err: any) {
      setError(`Failed to fetch weather data: ${err.message}`);
      console.error("Fetch error:", err);
    }
  };

  const handleSearch = (cityInput: string) => {
    console.log("handleSearch called with city:", cityInput);
    if (cityInput.trim()) {
      setCity(cityInput);
      fetchWeatherData(cityInput);
    }
  };

  const toggleTemperatureUnit = () => {
    console.log("Toggling temperature unit from:", temperatureUnit);
    setTemperatureUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  const convertTemperature = (temp: number) => {
    if (temperatureUnit === "F") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div className="flex flex-row gap-10">
      <CurrentWeather
        city={weatherData.city}
        country={weatherData.country}
        temperature={convertTemperature(weatherData.currentWeather.temperature)}
        temperatureUnit={temperatureUnit}
        icon={weatherData.currentWeather.icon}
        summary={weatherData.currentWeather.summary}
        description={weatherData.currentWeather.description}
      />
      <div className="flex flex-col flex-grow p-4 md:p-6 gap-6">
        <SearchBar
          temperatureUnit={temperatureUnit}
          toggleTemperatureUnit={toggleTemperatureUnit}
          onSearch={handleSearch}
        />
        <h2 className="text-xl font-semibold mb-3">3-Day Forecast</h2>
        <ForecastWeather forecasts={weatherData.forecastData} temperatureUnit={temperatureUnit} />
        <h2 className="text-xl font-semibold mb-3">Today&apos;s highlights</h2>
        <div className="flex justify-around items-center gap-2">
          <WindStatus
            windSpeed={weatherData.currentWeather.windSpeed}
            windDirection={weatherData.currentWeather.windDirection}
          />
          <HumidityStatus humidity={weatherData.currentWeather.humidity} />
        </div>
      </div>
    </div>
  );
}