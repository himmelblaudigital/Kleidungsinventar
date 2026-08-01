<?php
// Einmaliges Setup-Skript, um den ersten (Familien-)Benutzer anzulegen.
//
// Nutzung per SSH/Terminal (falls dogado-Paket PHP-CLI erlaubt):
//   php api/setup/create_user.php familie@beispiel.de "meinPasswort" "Familie Mustermann"
//
// Alternative ohne SSH: Zeile mit `php -r "echo password_hash('meinPasswort', PASSWORD_BCRYPT);"`
// lokal ausführen und den Hash manuell per phpMyAdmin in die Tabelle `users` eintragen:
//   INSERT INTO users (email, password_hash, name) VALUES ('familie@beispiel.de', '<HASH>', 'Familie Mustermann');
//
// WICHTIG: Diese Datei nach der Ersteinrichtung vom Server löschen oder den Zugriff sperren.

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Dieses Skript darf nur über die Kommandozeile (php-cli) ausgeführt werden.\n";
    exit(1);
}

require_once __DIR__ . '/../config_loader.php';
require_once __DIR__ . '/../db.php';

[$script, $email, $password, $name] = array_pad($argv, 4, null);

if (!$email || !$password) {
    fwrite(STDERR, "Nutzung: php create_user.php <email> <passwort> [name]\n");
    exit(1);
}

$pdo = get_pdo();
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name)'
);
$stmt->execute([$email, $hash, $name]);

echo "Benutzer '{$email}' wurde angelegt/aktualisiert.\n";
