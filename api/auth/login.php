<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method Not Allowed', 405);
}

$body = read_json_body();
$email = trim($body['email'] ?? '');
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '') {
    json_error('Email und Passwort erforderlich', 400);
}

$stmt = get_pdo()->prepare('SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_error('Ungültige Email oder Passwort', 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int)$user['id'];

json_response([
    'user' => [
        'id' => (int)$user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
    ],
]);
