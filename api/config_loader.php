<?php

function load_config(): array
{
    static $config = null;

    if ($config !== null) {
        return $config;
    }

    $path = __DIR__ . '/config.php';

    if (!file_exists($path)) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'error' => 'Server ist nicht konfiguriert. api/config.php fehlt (siehe api/config.example.php).',
        ]);
        exit;
    }

    $config = require $path;
    return $config;
}
