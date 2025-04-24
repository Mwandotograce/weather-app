<?php

namespace App\Http\Controllers;

use App\Http\Requests\WeatherRequest;
use App\Services\WeatherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;


class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function current(WeatherRequest $request): JsonResponse
    {
        $city = $request->input('city');
        $units = $request->input('units', 'metric');

        // Step 1: Get city coordinates
        $geoResponse = $this->weatherService->getCityCoordinates($city);

        if (!$geoResponse['success'] || empty($geoResponse['data'])) {
            return response()->json([
                'success' => false,
                'message' => 'City not found or Geocoding API error',
            ], $geoResponse['status'] ?? 404);
        }

        $coordinates = $geoResponse['data'][0];
        $lat = (float) $coordinates['lat'];
        $lon = (float) $coordinates['lon'];
        $coordString = "$lat,$lon";

        // Step 2: Fetch weather using coordinates
        $response = $this->weatherService->getWeatherByCoordinates($lat, $lon, $units);

        if (!$response['success']) {
            return response()->json([
                'success' => false,
                'message' => $response['message'],
            ], $response['status']);
        }

        $data = $response['data'];
        return response()->json([
            'success' => true,
            'data' => [
                'city' => $coordinates['name'],
                'country' => $data['sys']['country'] ?? 'N/A',
                'latitude' => $lat,
                'longitude' => $lon,
                'temperature' => $data['main']['temp'],
                'description' => $data['weather'][0]['description'],
                'weather_summary' => $data['weather'][0]['main'] . ': ' . $data['weather'][0]['description'],
                'icon' => $data['weather'][0]['icon'],
                'humidity' => $data['main']['humidity'],
                'wind_speed' => $data['wind']['speed'] ?? 0,
                'wind_direction' => $data['wind']['deg'] ?? 0,
            ],
        ]);
    }

    public function forecast(WeatherRequest $request): JsonResponse
    {
        $city = $request->input('city');
        $units = $request->input('units', 'metric');

        // Step 1: Get city coordinates
        $geoResponse = $this->weatherService->getCityCoordinates($city);

        if (!$geoResponse['success'] || empty($geoResponse['data'])) {
            return response()->json([
                'success' => false,
                'message' => 'City not found or Geocoding API error',
            ], $geoResponse['status'] ?? 404);
        }

        $coordinates = $geoResponse['data'][0];
        $lat = (float) $coordinates['lat'];
        $lon = (float) $coordinates['lon'];

        // Step 2: Fetch forecast
        $response = $this->weatherService->getWeatherForecastByCoordinates($lat, $lon, $units);

        if (!$response['success']) {
            return response()->json([
                'success' => false,
                'message' => $response['message'],
            ], $response['status']);
        }

        $data = $response['data'];
        $dailyForecasts = collect($data['list'])
            ->filter(fn($item) => str_contains($item['dt_txt'], '12:00:00'))
            ->map(fn($item) => [
                'date' => $item['dt_txt'],
                'temperature' => $item['main']['temp'],
                'temp_min' => $item['main']['temp_min'],
                'temp_max' => $item['main']['temp_max'],
                'description' => $item['weather'][0]['description'],
                'icon' => $item['weather'][0]['icon'],
                'humidity' => $item['main']['humidity'],
                'wind_speed' => $item['wind']['speed'] ?? 0,
            ])
            ->values()
            ->take(3);

        return response()->json([
            'success' => true,
            'data' => [
                'city' => $coordinates['name'],
                'country' => $data['city']['country'] ?? 'N/A',
                'latitude' => $lat,
                'longitude' => $lon,
                'forecasts' => $dailyForecasts,
            ],
        ]);
    }

    public function combinedweatherdata(WeatherRequest $request): JsonResponse
    {
        $city = $request->input('city');
        $units = $request->input('units', 'metric');

        //gett city coordinates
        $geoResponse = $this->weatherService->getCityCoordinates($city);
        if (!$geoResponse['success'] || empty($geoResponse['data'])) {
            return response()->json([
                'success' => false,
                'message' => 'City not found or Geocoding API error',
            ], $geoResponse['status'] ?? 404);
        }

        $coordinates = $geoResponse['data'][0];
        $lat = (float) $coordinates['lat'];
        $lon = (float) $coordinates['lon'];
        $coordString = "$lat,$lon";

        // fetch current weathe
        $currentResponse = $this->weatherService->getWeatherByCoordinates($lat, $lon, $units);
        if (!$currentResponse['success']) {
            return response()->json([
                'success' => false,
                'message' => $currentResponse['message'],
            ], $currentResponse['status']);
        }

        // fetch forecast
        $forecastResponse = $this->weatherService->getWeatherForecastByCoordinates($lat, $lon, $units);
        if (!$forecastResponse['success']) {
            return response()->json([
                'success' => false,
                'message' => $forecastResponse['message'],
            ], $forecastResponse['status']);
        }

        // process current weather
        $currentData = $currentResponse['data'];
        $current = [
            'city' => $coordinates['name'],
            'country' => $currentData['sys']['country'] ?? 'N/A',
            'latitude' => $lat,
            'longitude' => $lon,
            'temperature' => $currentData['main']['temp'],
            'description' => $currentData['weather'][0]['description'],
            'weather_summary' => $currentData['weather'][0]['main'] . ': ' . $currentData['weather'][0]['description'],
            'icon' => $currentData['weather'][0]['icon'],
            'humidity' => $currentData['main']['humidity'],
            'wind_speed' => $currentData['wind']['speed'] ?? 0,
            'wind_direction' => $currentData['wind']['deg'] ?? 0,
        ];

        // proccess forecast
        $forecastData = $forecastResponse['data'];
        $dailyForecasts = collect($forecastData['list'])
            ->filter(fn($item) => str_contains($item['dt_txt'], '12:00:00'))
            ->map(fn($item) => [
                'date' => $item['dt_txt'],
                'temperature' => $item['main']['temp'],
                'temp_min' => $item['main']['temp_min'],
                'temp_max' => $item['main']['temp_max'],
                'description' => $item['weather'][0]['description'],
                'icon' => $item['weather'][0]['icon'],
                'humidity' => $item['main']['humidity'],
                'wind_speed' => $item['wind']['speed'] ?? 0,
            ])
            ->values()
            ->take(3);

        return response()->json([
            'success' => true,
            'data' => [
                'current' => $current,
                'forecast' => $dailyForecasts,
            ],
        ]);
    }
}