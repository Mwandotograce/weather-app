<?php

use App\Http\Controllers\WeatherController; //imports WeatherCotroller class
use Illuminate\Support\Facades\Route; //imports Laravel's route facade which provides the methods for defining endpoints

Route::get('/weather/current', [WeatherController::class, 'current']); //maps requests to the current method in the class
Route::get('/weather/forecast', [WeatherController::class, 'forecast']);
