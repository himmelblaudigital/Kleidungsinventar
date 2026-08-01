<?php
// Kopiere diese Datei zu config.php und trage deine dogado-MySQL-Zugangsdaten ein.
// config.php ist in .gitignore und wird NICHT ins Repository übernommen.

return [
    // dogado MySQL-Zugangsdaten (siehe dogado-Kundencenter -> Datenbanken)
    'db' => [
        'host' => 'localhost',
        'name' => 'dbXXXXXXXXX',
        'user' => 'dbXXXXXXXXX',
        'pass' => 'CHANGE_ME',
        'charset' => 'utf8mb4',
    ],

    // Herkünfte, die per Cookie-Session auf die API zugreifen dürfen.
    // In Produktion i.d.R. nur die eigene Domain (gleicher Origin -> leer lassen reicht meist).
    // Für lokale Entwicklung mit `npm run dev` wird über den Vite-Proxy kein CORS benötigt.
    'allowed_origins' => [
        // 'https://kleidung.deine-domain.de',
    ],

    // Muss true sein, sobald die App über HTTPS läuft (Pflicht in Produktion).
    'session_cookie_secure' => true,

    // Verzeichnis, in das hochgeladene Bilder gespeichert werden (muss beschreibbar sein).
    'upload_dir' => __DIR__ . '/uploads',

    // Öffentlich erreichbarer URL-Pfad zum Upload-Verzeichnis.
    'upload_url_base' => '/api/uploads',
];
