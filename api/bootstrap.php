<?php
require_once __DIR__ . '/config_loader.php';
require_once __DIR__ . '/db.php';

$GLOBALS['__config'] = load_config();

function config(string $key)
{
    return $GLOBALS['__config'][$key] ?? null;
}

// --- CORS (nur relevant, falls Frontend und API auf unterschiedlichen Origins laufen) ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = config('allowed_origins') ?? [];
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- Session ---
session_set_cookie_params([
    'lifetime' => 60 * 60 * 24 * 30, // 30 Tage
    'path' => '/',
    'secure' => (bool)config('session_cookie_secure'),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    json_response(['error' => $message], $status);
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Ungültiger Request-Body', 400);
    }
    return $data;
}

function current_user_id(): ?int
{
    return $_SESSION['user_id'] ?? null;
}

function require_auth(): int
{
    $userId = current_user_id();
    if ($userId === null) {
        json_error('Nicht angemeldet', 401);
    }
    return $userId;
}
