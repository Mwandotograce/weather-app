<?php

namespace App\Services;

use GuzzleHttp\Client; // Guzzle HTTP client for making API requests


class WeatherService
{
    protected $client;
    protected $apiKey;
    protected $baseUrl;

    /**
     * WeatherService constructor.
     */
    public function __construct()
    {
        // Initialize Guzzle client and API configurations
        $this->client = new Client();
        $this->apiKey = env('OPENWEATHERMAP_API_KEY'); // API Key from environment file
        $this->baseUrl = 'https://api.openweathermap.org/data/2.5/';
    }

    /**
     * Fetch current weather data for a given city.
     *
     * @param string $city
     * @param string $units
     * @return array
     */
    public function getWeatherByCity(string $city, string $units = 'metric'): array
    {
        $endpoint = 'weather';
        $queryParams = [
            'q' => $city,
            'units' => $units,
            'appid' => $this->apiKey,
        ];

        return $this->makeRequest($endpoint, $queryParams);
    }

    /**
     * Fetch weather forecast data for a given city.
     *
     * @param string $city
     * @param string $units
     * @return array
     */
    public function getWeatherForecastByCity(string $city, string $units = 'metric'): array
    {
        $endpoint = 'forecast';
        $queryParams = [
            'q' => $city,
            'units' => $units,
            'appid' => $this->apiKey,
        ];

        return $this->makeRequest($endpoint, $queryParams);
    }

    /**
     * Make a GET request to the OpenWeather API.
     *
     * @param string $endpoint
     * @param array $queryParams
     * @return array
     */
    private function makeRequest(string $endpoint, array $queryParams): array
    {
        try {
            $url = $this->baseUrl . $endpoint;
            $response = $this->client->request('GET', $url, [
                'query' => $queryParams,
                'verify' => false,
            ]);
            $data = json_decode($response->getBody()->getContents(), true);
            return [
                'success' => true,
                'data' => $data,
                'status' => $response->getStatusCode(),
            ];
        } catch (\Throwable $exception) {
            return [
                'success' => false,
                'message' => $exception->getMessage(),
                'status' => $exception->getCode() ?: 500,
            ];
        }
    }

    public function getCityCoordinates(string $city, int $limit = 1): array
{
    $endpoint = 'geo/1.0/direct';
    $queryParams = [
        'q' => $city,
        'limit' => $limit,
        'appid' => $this->apiKey,
    ];

    return $this->makeRequest($endpoint, $queryParams);
}

}
