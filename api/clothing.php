<?php
require_once __DIR__ . '/bootstrap.php';

require_auth();

$pdo = get_pdo();
$method = $_SERVER['REQUEST_METHOD'];

function clothing_to_json(array $row): array
{
    return [
        'id' => (int)$row['id'],
        'personId' => (int)$row['person_id'],
        'kategorie' => $row['kategorie'],
        'farbe' => $row['farbe'],
        'marke' => $row['marke'],
        'groesse' => $row['groesse'],
        'status' => $row['status'],
        'notizen' => $row['notizen'],
        'imageUrl' => $row['image_url'],
        'imagePath' => $row['image_path'],
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM clothing ORDER BY created_at ASC');
    $items = array_map('clothing_to_json', $stmt->fetchAll());
    json_response($items);
}

if ($method === 'POST') {
    $body = read_json_body();
    $personId = (int)($body['personId'] ?? 0);

    if ($personId <= 0) {
        json_error('personId ist erforderlich', 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO clothing (person_id, kategorie, farbe, marke, groesse, status, notizen, image_url, image_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $personId,
        $body['kategorie'] ?? null,
        $body['farbe'] ?? null,
        $body['marke'] ?? null,
        $body['groesse'] ?? null,
        $body['status'] ?? 'vorhanden',
        $body['notizen'] ?? null,
        $body['imageUrl'] ?? null,
        $body['imagePath'] ?? null,
    ]);

    $id = (int)$pdo->lastInsertId();
    json_response(['id' => $id], 201);
}

if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_error('id fehlt', 400);
    }

    $stmt = $pdo->prepare('SELECT * FROM clothing WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) {
        json_error('Kleidungsstück nicht gefunden', 404);
    }

    $body = read_json_body();

    // Partial-Update: nur übermittelte Felder überschreiben, Rest bleibt bestehen.
    $merged = [
        'person_id' => isset($body['personId']) ? (int)$body['personId'] : $existing['person_id'],
        'kategorie' => array_key_exists('kategorie', $body) ? $body['kategorie'] : $existing['kategorie'],
        'farbe' => array_key_exists('farbe', $body) ? $body['farbe'] : $existing['farbe'],
        'marke' => array_key_exists('marke', $body) ? $body['marke'] : $existing['marke'],
        'groesse' => array_key_exists('groesse', $body) ? $body['groesse'] : $existing['groesse'],
        'status' => array_key_exists('status', $body) ? $body['status'] : $existing['status'],
        'notizen' => array_key_exists('notizen', $body) ? $body['notizen'] : $existing['notizen'],
        'image_url' => array_key_exists('imageUrl', $body) ? $body['imageUrl'] : $existing['image_url'],
        'image_path' => array_key_exists('imagePath', $body) ? $body['imagePath'] : $existing['image_path'],
    ];

    $stmt = $pdo->prepare(
        'UPDATE clothing SET person_id = ?, kategorie = ?, farbe = ?, marke = ?, groesse = ?, status = ?, notizen = ?, image_url = ?, image_path = ?
         WHERE id = ?'
    );
    $stmt->execute([
        $merged['person_id'],
        $merged['kategorie'],
        $merged['farbe'],
        $merged['marke'],
        $merged['groesse'],
        $merged['status'],
        $merged['notizen'],
        $merged['image_url'],
        $merged['image_path'],
        $id,
    ]);

    json_response(['success' => true]);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        json_error('id fehlt', 400);
    }

    $stmt = $pdo->prepare('DELETE FROM clothing WHERE id = ?');
    $stmt->execute([$id]);

    json_response(['success' => true]);
}

json_error('Method Not Allowed', 405);
