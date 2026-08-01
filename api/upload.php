<?php
require_once __DIR__ . '/bootstrap.php';

require_auth();

$method = $_SERVER['REQUEST_METHOD'];
$ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$MAX_SIZE = 5 * 1024 * 1024; // 5MB

function upload_dir(): string
{
    return rtrim(config('upload_dir'), '/');
}

function upload_url_base(): string
{
    return rtrim(config('upload_url_base'), '/');
}

// storagePath ist immer relativ, z.B. "clothing/12/34/image.jpg"
function resolve_upload_path(string $storagePath): ?string
{
    $storagePath = ltrim($storagePath, '/');
    if (!preg_match('#^clothing/[0-9]+/[0-9]+/image\.[a-z]+$#', $storagePath)) {
        return null;
    }
    return upload_dir() . '/' . $storagePath;
}

if ($method === 'POST') {
    $personId = (int)($_POST['personId'] ?? 0);
    $clothingId = (int)($_POST['clothingId'] ?? 0);

    if ($personId <= 0 || $clothingId <= 0) {
        json_error('personId und clothingId sind erforderlich', 400);
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        json_error('Kein gültiges Bild empfangen', 400);
    }

    $file = $_FILES['image'];

    if ($file['size'] > $MAX_SIZE) {
        json_error('Bild ist zu groß (max. 5MB)', 400);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $mimeToExt = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp',
    ];

    if (!isset($mimeToExt[$mimeType])) {
        json_error('Datei muss ein Bild sein (JPEG, PNG, GIF oder WebP)', 400);
    }

    $extension = $mimeToExt[$mimeType];
    $relativeDir = "clothing/{$personId}/{$clothingId}";
    $targetDir = upload_dir() . '/' . $relativeDir;

    if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        json_error('Upload-Verzeichnis konnte nicht erstellt werden', 500);
    }

    // Alte Bilder mit anderer Endung in diesem Ordner entfernen
    foreach (glob($targetDir . '/image.*') ?: [] as $oldFile) {
        unlink($oldFile);
    }

    $storagePath = "{$relativeDir}/image.{$extension}";
    $targetPath = upload_dir() . '/' . $storagePath;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        json_error('Bild konnte nicht gespeichert werden', 500);
    }

    json_response([
        'url' => upload_url_base() . '/' . $storagePath,
        'path' => $storagePath,
    ], 201);
}

if ($method === 'DELETE') {
    $body = read_json_body();
    $storagePath = $body['path'] ?? '';

    if ($storagePath === '') {
        json_response(['success' => true]); // Nichts zu löschen
    }

    $fullPath = resolve_upload_path($storagePath);
    if ($fullPath === null) {
        json_error('Ungültiger Pfad', 400);
    }

    if (file_exists($fullPath)) {
        unlink($fullPath);
    }

    json_response(['success' => true]);
}

json_error('Method Not Allowed', 405);
