<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::controller(ProductController::class)->group(function () {
    // método ruta y método que equivale en el controlador de Product
    // importante la convención RESTful estándar (todos los endpoints de un recurso usan el plural)
    Route::get('/products', 'index');
    Route::post('/products', 'store');
    Route::get('/products/{id}', 'show');
    Route::put('/products/{id}', 'update');
    Route::delete('/products/{id}', 'destroy');
});