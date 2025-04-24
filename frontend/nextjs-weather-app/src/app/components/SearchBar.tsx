"use client";

import { useState } from "react";

export default function SearchBar({
  temperatureUnit,
  toggleTemperatureUnit,
  onSearch,
}: {
  temperatureUnit: string;
  toggleTemperatureUnit: () => void;
  onSearch: (city: string) => void;
}) {
  const [cityInput, setCityInput] = useState<string>("");

  const handleSearch = () => {
    console.log("Search button clicked, city:", cityInput);
    if (cityInput.trim()) {
      onSearch(cityInput);
      setCityInput("");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 gap-2">
      <div className="flex flex-grow gap-2">
        <input
          className="input"
          placeholder="Search City..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="flex gap-1">
        <button
          className={`btn-circle ${temperatureUnit === "C" ? "btn-active" : ""}`}
          onClick={toggleTemperatureUnit}
        >
          °C
        </button>
        <button
          className={`btn-circle ${temperatureUnit === "F" ? "btn-active" : ""}`}
          onClick={toggleTemperatureUnit}
        >
          °F
        </button>
      </div>
    </div>
  );
}