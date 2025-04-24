import { ForecastData } from "../interfaces/weatherdata";

export default function ForecastWeather({
  forecasts,
  temperatureUnit,
}: {
  forecasts: ForecastData[];
  temperatureUnit: string;
}) {
  const convertTemperature = (temp: number) => {
    if (temperatureUnit === "F") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  return (
    <div className="flex justify-around items-center gap-4">
      {forecasts.map((forecast, index) => (
        <div
          key={index}
          className="card card-compact flex-grow bg-base-100 shadow-xl items-center text-center p-6"
        >
          <div className="text-sm font-semibold mb-1">{forecast.date}</div>
          <img
            src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
            alt="Weather Icon"
            className="w-16 h-16"
          />
          <div className="text-xs text-gray-500">
            {convertTemperature(forecast.temp_min).toFixed(1)}°{temperatureUnit} -{" "}
            {convertTemperature(forecast.temp_max).toFixed(1)}°{temperatureUnit}
          </div>
          <div className="text-sm">{forecast.description}</div>
        </div>
      ))}
    </div>
  );
}