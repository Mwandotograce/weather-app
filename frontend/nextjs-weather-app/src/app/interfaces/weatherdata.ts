export interface CurrentWeather {
    temperature: number; //degrees celcius/farenheit
    summary: string;
    description: string;
    icon: string;
    windSpeed: number; //km per hr
    windDirection: number; //degrees magnetic
    humidity: number;
}

export interface ForecastData {
    date: string;
    temperature: number;
    temp_min: number;
    temp_max: number;
    description: string;
    summary: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
  }
  
  export interface WeatherData {
    city: string;
    country: string;
    currentWeather: CurrentWeather;
    forecastData: ForecastData[];
  }
  
  