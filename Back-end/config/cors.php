<?php

return [
    'paths' => ['*', 'sanctum/csrf-cookie'], // Autorise toutes les routes
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'], // Ton URL React
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Indispensable pour les cookies de session
];