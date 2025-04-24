"use client";

import { useState, FormEvent } from "react";
import WeatherDisplay from "../components/WeatherDisplay";

interface WeatherData {
  city: string;
  country: string;
  date: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  units: string;
  forecast: { date: string; temperature: number; description: string; icon: string }[];
}

export default function Home() {
  const [city, setCity] = useState("");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e: FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/weather/current?city=${encodeURIComponent(city)}&units=${units}`,
        { method: "GET" }
      );
      const data = await res.json();
      if (data.success) {
        setWeather(data.data);
      } else {
        setError(data.message || "Failed to fetch weather data");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Weather App</h1>
      <form onSubmit={fetchWeather} className="w-full max-w-md mb-6 flex flex-col gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g., London)"
          className="input w-full"
          disabled={loading}
        />
        <select
          value={units}
          onChange={(e) => setUnits(e.target.value as "metric" | "imperial")}
          className="select w-full"
          disabled={loading}
        >
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
        </select>
        <button
          type="submit"
          className={`btn btn-primary${loading ? " loading" : ""}`}
          disabled={loading}
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {weather && <WeatherDisplay weather={weather} />}
    </div>
  );
}