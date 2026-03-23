<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Active Sanctum pour les applications SPA comme React
        $middleware->statefulApi();

        // Autorise la route /login à recevoir des requêtes POST sans jeton CSRF
        $middleware->validateCsrfTokens(except: [
            '/login',
            '/budget',
            '/register',
            'user/update',
            '/logout',
            '/transactions',
            '/transactions/*', 
            '/budgets',
            '/budgets/*',
            '/categorie',
            '/categorie/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();