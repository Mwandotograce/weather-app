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
        ], $geoResponse['status']);
    }

    $coordinates = $geoResponse['data'][0]; // Use the first result
    $lat = $coordinates['lat'];
    $lon = $coordinates['lon'];

    // Step 2: Fetch weather using coordinates
    $response = $this->weatherService->getWeatherByCity("$lat,$lon", $units);

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
            'latitude' => $lat,
            'longitude' => $lon,
            'temperature' => $data['main']['temp'],
            'description' => $data['weather'][0]['description'],
            'icon' => $data['weather'][0]['icon'],
            'humidity' => $data['main']['humidity'],
            'wind_speed' => $data['wind']['speed'],
        ],
    ]);
}


    public function forecast(WeatherRequest $request): JsonResponse
    {
        $city = $request->input('city');
        $units = $request->input('units', 'metric');
        $response = $this->weatherService->getWeatherForecastByCity($city, $units);

        if (!$response['success']) {
            return response()->json([
                'success' => false,
                'message' => $response['message']
            ], $response['status']);
        }

        $data = $response['data'];
        $dailyForecasts = collect($data['list'])
            ->filter(fn($item) => str_contains($item['dt_txt'], '12:00:00'))
            ->map(fn($item) => [
                'date' => $item['dt_txt'],
                'temperature' => $item['main']['temp'],
                'description' => $item['weather'][0]['description'],
                'icon' => $item['weather'][0]['icon'],
            ])
            ->values()
            ->take(5);

        return response()->json([
            'success' => true,
            'data' => $dailyForecasts,
        ]);
    }
}