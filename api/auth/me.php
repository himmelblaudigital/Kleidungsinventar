<?php
require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method Not Allowed', 405);
}

$userId = current_user_id();

if ($userId === null) {
    json_response(['user' => null]);
}

$stmt = get_pdo()->prepare('SELECT id, email, name FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
    // Session verweist auf gelöschten Benutzer
    $_SESSION = [];
    session_destroy();
    json_response(['user' => null]);
}

json_response([
    'user' => [
        'id' => (int)$user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
    ],
]);
