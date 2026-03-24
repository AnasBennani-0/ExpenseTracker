<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

// Route de connexion accessible par React
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $req) {
        return $req->user();
    });
    Route::get('/user-data', function () {
        return response()->json(Auth::user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::resource('transactions', TransactionController::class);
    Route::resource('budgets',BudgetController::class);
    Route::resource("categorie", CategorieController::class); 
    Route::get('/dashboard/stats', [TransactionController::class, 'getDashboardStats']);
    Route::put('/user/update', [AuthController::class, 'update']);
    Route::get('/budgets/sum/{id}', [BudgetController::class, 'getBudgetSum']);
});
Route::post('/register',[AuthController::class,'register']);