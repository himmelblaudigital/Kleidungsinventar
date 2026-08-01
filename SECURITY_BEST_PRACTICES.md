# Sicherheits-Hinweise (PHP/MySQL-API)

## Aktuelle Sicherheitslage

**Status:** 🟢 Für den Einsatz als privates Familien-Tool geeignet, wenn die Punkte unten beachtet werden.

Alle Datenzugriffe laufen über `api/*.php` und erfordern eine gültige Login-Session (`require_auth()` in `api/bootstrap.php`). Es gibt **keinen** öffentlichen, unauthentifizierten Lese-/Schreibzugriff auf Personen oder Kleidungsstücke.

## Was bereits umgesetzt ist

- **Authentifizierung:** Passwörter werden mit `password_hash()` (bcrypt) gespeichert, nie im Klartext (`db/schema.sql`, `api/auth/login.php`)
- **Session-Schutz:** Session-Cookie ist `HttpOnly` (kein Zugriff per JavaScript) und in Produktion `Secure` (nur über HTTPS)
- **SQL-Injection-Schutz:** Alle Datenbankzugriffe nutzen PDO Prepared Statements (`api/persons.php`, `api/clothing.php`, `api/auth/login.php`)
- **Zugriffskontrolle:** Jeder Daten-Endpunkt (`persons.php`, `clothing.php`, `upload.php`) prüft über `require_auth()`, ob eine gültige Session vorliegt
- **Upload-Validierung:** `api/upload.php` prüft Dateigröße (max. 5MB) und echten MIME-Type (nicht nur Dateiendung) und erlaubt nur JPEG/PNG/GIF/WebP
- **Keine Codeausführung aus Uploads:** `api/uploads/.htaccess` deaktiviert PHP-Ausführung im Upload-Verzeichnis
- **Geschützte Interna:** `api/config.php`, `db.php`, `bootstrap.php`, `config_loader.php` sind per `api/.htaccess` vor direktem Web-Zugriff gesperrt
- **Pfad-Validierung:** `api/upload.php` akzeptiert beim Löschen nur Pfade, die dem erwarteten Muster `clothing/{personId}/{clothingId}/image.{ext}` entsprechen (kein Path Traversal)

## Zusätzliche Empfehlungen

### 1. Nach der Ersteinrichtung aufräumen

- `api/setup/generate_password_hash.php` vom Server löschen, sobald der erste Benutzer angelegt ist – sie ist sonst öffentlich erreichbar und erzeugt beliebige Passwort-Hashes
- `api/config.php` niemals ins Git-Repository committen (ist bereits in `.gitignore`)

### 2. HTTPS erzwingen

- In `api/config.php`: `session_cookie_secure => true`, sobald die App über HTTPS läuft
- dogado stellt für eigene Domains i.d.R. kostenlose SSL-Zertifikate bereit

### 3. Content Security Policy (Optional)

Kann in `index.html` ergänzt werden, z.B.:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';">
```

### 4. Rate Limiting / Brute-Force-Schutz (Optional)

`api/auth/login.php` hat aktuell kein eingebautes Rate Limiting. Für zusätzlichen Schutz gegen Passwort-Raten:
- Fail2Ban auf Serverebene (bei eigenem Server, nicht bei dogado Shared Hosting verfügbar)
- Oder eine einfache Zähl-Logik pro IP in `login.php` ergänzen (z.B. via Tabelle `login_attempts`)

### 5. Backups

- Regelmäßige Backups der MySQL-Datenbank (dogado-Kundencenter bietet i.d.R. automatische Backups, zusätzlich manuelle Exports über phpMyAdmin empfehlenswert)
- Regelmäßige Backups von `api/uploads/` (Kleidungsbilder liegen nur dort, nicht in der Datenbank)

## Checkliste

**Sofort nach dem Deployment:**
- [ ] `api/config.php` mit echten dogado-Zugangsdaten angelegt (nicht `config.example.php`)
- [ ] Erster Benutzer angelegt, danach `generate_password_hash.php` gelöscht
- [ ] `session_cookie_secure` auf `true`, sobald HTTPS aktiv ist

**Empfohlen:**
- [ ] CSP-Header ergänzt
- [ ] Backup-Routine für Datenbank + `api/uploads/` eingerichtet

**Optional:**
- [ ] Rate Limiting für Login implementiert
