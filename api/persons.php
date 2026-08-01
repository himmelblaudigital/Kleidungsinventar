<?php
require_once __DIR__ . '/bootstrap.php';

require_auth();

$pdo = get_pdo();
$method = $_SERVER['REQUEST_METHOD'];

function person_to_json(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'kategorie' => $row['kategorie'],
        'groesse' => $row['groesse'],
        'avatar' => $row['avatar'],
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM persons ORDER BY created_at ASC');
    $persons = array_map('person_to_json', $stmt->fetchAll());
    json_response($persons);
}

if ($method === 'POST') {
    $body = read_json_body();
    $name = trim($body['name'] ?? '');

    if ($name === '') {
        json_error('Name ist erforderlich', 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO persons (name, kategorie, groesse, avatar) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([
        $name,
        $body['kategorie'] ?? null,
        $body['groesse'] ?? null,
        $body['avatar'] ?? null,
    ]);

    $id = (int)$pdo->lastInsertId();
    json_response(['id' => $id], 201);
}

if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_error('id fehlt', 400);
    }

    $body = read_json_body();
    $name = trim($body['name'] ?? '');
    if ($name === '') {
        json_error('Name ist erforderlich', 400);
    }

    $stmt = $pdo->prepare(
        'UPDATE persons SET name = ?, kategorie = ?, groesse = ?, avatar = ? WHERE id = ?'
    );
    $stmt->execute([
        $name,
        $body['kategorie'] ?? null,
        $body['groesse'] ?? null,
        $body['avatar'] ?? null,
        $id,
    ]);

    json_response(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_error('id fehlt', 400);
    }

    $stmt = $pdo->prepare('DELETE FROM persons WHERE id = ?');
    $stmt->execute([$id]);

    json_response(['success' => true]);
}

json_error('Method Not Allowed', 405);
