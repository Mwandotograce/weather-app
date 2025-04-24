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
  
  export default function WeatherDisplay({ weather }: { weather: WeatherData }) {
    return (
      <div className="card w-full max-w-md bg-white shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-gray-500">{weather.date}</p>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
              alt={weather.description}
              className="w-16 h-16"
            />
            <div>
              <p className="text-2xl font-semibold capitalize">{weather.description}</p>
              <p className="text-4xl">{weather.temperature}° {weather.units}</p>
            </div>
          </div>
          <p className="mb-2">Humidity: {weather.humidity}%</p>
          <p className="mb-4">
            Wind Speed: {weather.wind_speed} {weather.units === "Celsius" ? "m/s" : "mph"}
          </p>
          <h3 className="text-lg font-semibold mb-2">3-Day Forecast</h3>
          <div className="grid grid-cols-3 gap-4">
            {weather.forecast.map((day) => (
              <div key={day.date} className="text-center">
                <p className="text-sm">{day.date}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="w-12 h-12 mx-auto"
                />
                <p className="text-sm">{day.temperature}°</p>
                <p className="text-xs capitalize">{day.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }