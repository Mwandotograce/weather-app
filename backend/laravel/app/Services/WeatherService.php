<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class WeatherService
{
    protected $client;
    protected $apiKey;

    public function __construct(Client $client)
    {
        $this->client = $client;
        $this->apiKey = config('services.openweathermap.key');
        Log::debug('WeatherService initialized', ['api_key' => $this->apiKey]);
    }

    public function getCityCoordinates(string $city): array
    {
        try {
            $url = 'https://api.openweathermap.org/geo/1.0/direct?q=' . urlencode($city) . '&limit=1&appid=' . $this->apiKey;
            Log::debug('Geocoding API Request', ['url' => $url, 'api_key' => $this->apiKey]);
            $response = $this->client->request('GET', 'http://api.openweathermap.org/geo/1.0/direct', [
                'query' => [
                    'q' => $city,
                    'limit' => 1,
                    'appid' => $this->apiKey,
                ],
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            return [
                'success' => true,
                'data' => $data,
                'status' => $response->getStatusCode(),
            ];
        } catch (\Throwable $exception) {
            $status = $exception instanceof RequestException && $exception->hasResponse()
                ? $exception->getResponse()->getStatusCode()
                : 500;
            Log::error('Geocoding API error: ' . $exception->getMessage());
            return [
                'success' => false,
                'message' => $exception->getMessage(),
                'status' => $status,
            ];
        }
    }

    public function getWeatherByCoordinates(float $lat, float $lon, string $units = 'metric'): array
    {
        try {
            $url = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $lat . '&lon=' . $lon . '&units=' . $units . '&appid=' . $this->apiKey;
            Log::debug('Weather API Request', ['url' => $url, 'api_key' => $this->apiKey]);
            $response = $this->client->request('GET', 'http://api.openweathermap.org/data/2.5/weather', [
                'query' => [
                    'lat' => $lat,
                    'lon' => $lon,
                    'units' => $units,
                    'appid' => $this->apiKey,
                ],
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            return [
                'success' => true,
                'data' => $data,
                'status' => $response->getStatusCode(),
            ];
        } catch (\Throwable $exception) {
            $status = $exception instanceof RequestException && $exception->hasResponse()
                ? $exception->getResponse()->getStatusCode()
                : 500;
            Log::error('Weather API error: ' . $exception->getMessage());
            return [
                'success' => false,
                'message' => $exception->getMessage(),
                'status' => $status,
            ];
        }
    }

    public function getWeatherForecastByCoordinates(float $lat, float $lon, string $units = 'metric'): array
    {
        try {
            $url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' . $lat . '&lon=' . $lon . '&units=' . $units . '&appid=' . $this->apiKey;
            Log::debug('Forecast API Request', ['url' => $url, 'api_key' => $this->apiKey]);
            $response = $this->client->request('GET', 'http://api.openweathermap.org/data/2.5/forecast', [
                'query' => [
                    'lat' => $lat,
                    'lon' => $lon,
                    'units' => $units,
                    'appid' => $this->apiKey,
                ],
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            return [
                'success' => true,
                'data' => $data,
                'status' => $response->getStatusCode(),
            ];
        } catch (\Throwable $exception) {
            $status = $exception instanceof RequestException && $exception->hasResponse()
                ? $exception->getResponse()->getStatusCode()
                : 500;
            Log::error('Forecast API error: ' . $exception->getMessage());
            return [
                'success' => false,
                'message' => $exception->getMessage(),
                'status' => $status,
            ];
        }
    }
}