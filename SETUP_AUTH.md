# Login-System Einrichtung (MySQL)

## Übersicht

Die App verwendet ein eigenes, session-basiertes Login über die PHP-API (`api/auth/*.php`) und eine `users`-Tabelle in MySQL. Nur authentifizierte Benutzer haben Zugriff auf die Daten.

## Schritte zur Einrichtung

### 1. Datenbank-Schema importieren

Importiere `db/schema.sql` in deine dogado-MySQL-Datenbank, z.B. per phpMyAdmin (dogado-Kundencenter → Datenbanken → phpMyAdmin) oder per CLI:

```bash
mysql -u DEIN_DB_USER -p DEIN_DB_NAME < db/schema.sql
```

Das legt die Tabellen `users`, `persons` und `clothing` an.

### 2. API-Konfiguration anlegen

```bash
cp api/config.example.php api/config.php
```

Trage in `api/config.php` deine dogado-MySQL-Zugangsdaten ein (Host meist `localhost`, DB-Name/User/Passwort aus dem dogado-Kundencenter). `api/config.php` ist in `.gitignore` und wird nicht versioniert.

### 3. Ersten Benutzer anlegen

**Falls dein dogado-Paket SSH/PHP-CLI erlaubt:**

```bash
php api/setup/create_user.php familie@beispiel.de "meinSicheresPasswort" "Familie Mustermann"
```

**Ohne SSH-Zugriff (nur FTP/Webinterface):**

1. Lade `api/setup/generate_password_hash.php` auf den Server hoch
2. Öffne die Datei im Browser (z.B. `https://deine-domain.de/api/setup/generate_password_hash.php`)
3. Gib das gewünschte Passwort ein und kopiere den erzeugten Hash
4. Trage in phpMyAdmin per SQL-Befehl einen Benutzer ein:
   ```sql
   INSERT INTO users (email, password_hash, name)
   VALUES ('familie@beispiel.de', '<HASH_HIER_EINFÜGEN>', 'Familie Mustermann');
   ```
5. **Lösche `api/setup/generate_password_hash.php` danach unbedingt wieder vom Server** – sonst ist sie öffentlich erreichbar.

**Empfehlung:** Verwende einen Passwort-Manager für das Familienpasswort.

### 4. App testen

1. Starte die App: `npm run dev` (und lokal parallel `php -S localhost:8000` im Projekt-Root für die API, siehe `vite.config.js`)
2. Du solltest jetzt einen Login-Bildschirm sehen
3. Melde dich mit der angelegten Email und dem Passwort an
4. Nach erfolgreicher Anmeldung siehst du das Dashboard
5. Teste den Logout-Button (rechts oben)

## Sicherheitshinweise

✅ **Was ist jetzt sicher:**
- Nur authentifizierte Benutzer (gültige Session) haben Zugriff auf die API-Endpunkte (`persons.php`, `clothing.php`, `upload.php`)
- Passwörter werden mit `password_hash()` (bcrypt) gehasht, niemals im Klartext gespeichert
- Session-Cookie ist `HttpOnly` und (in Produktion) `Secure`, bleibt nach Browser-Neustart erhalten
- `api/config.php` und Interna (`db.php`, `bootstrap.php`, …) sind per `.htaccess` vor direktem Web-Zugriff geschützt
- Hochgeladene Bilder können nicht als PHP ausgeführt werden (`api/uploads/.htaccess`)

⚠️ **Wichtig zu wissen:**
- Dies ist ein **gemeinsamer Account** für die ganze Familie (es können bei Bedarf mehrere Zeilen in `users` angelegt werden)
- Alle angemeldeten Personen haben **volle Zugriffs- und Löschrechte**
- Es gibt keine Rollen oder Berechtigungen pro Person im Haushalt
- Die App ist öffentlich zugänglich, aber nur mit Passwort nutzbar
- `session_cookie_secure` in `api/config.php` **muss** `true` sein, sobald HTTPS aktiv ist (siehe DEPLOYMENT.md)

## Passwort ändern / vergessen?

Wiederhole Schritt 3 (`create_user.php` bzw. `generate_password_hash.php` + `UPDATE users SET password_hash = ... WHERE email = ...`). `create_user.php` überschreibt bei bereits existierender Email automatisch den Hash (`ON DUPLICATE KEY UPDATE`).

## Troubleshooting

### "Nicht angemeldet" (401) trotz Login
- Prüfe, ob Cookies vom Browser blockiert werden (Drittanbieter-Cookie-Blocker, Inkognito-Einstellungen)
- Stelle sicher, dass Frontend und API auf derselben Domain laufen, oder trage die Frontend-Origin in `allowed_origins` in `api/config.php` ein

### Login funktioniert nicht
- Überprüfe Email und Passwort auf Tippfehler
- Prüfe in phpMyAdmin, ob der Benutzer in der Tabelle `users` existiert
- Schaue in die Browser-Konsole (Netzwerk-Tab, Request an `api/auth/login.php`) nach Fehlermeldungen

### "Server ist nicht konfiguriert"
- `api/config.php` fehlt oder wurde nicht aus `api/config.example.php` kopiert

### App lädt ewig
- Prüfe, ob `api/config.php` korrekte MySQL-Zugangsdaten enthält
- Schaue in die PHP-Error-Logs des Hosters (dogado-Kundencenter) nach Fehlermeldungen
