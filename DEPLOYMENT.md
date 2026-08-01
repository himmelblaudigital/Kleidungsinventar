# Deployment-Anleitung (dogado / eigener Server mit PHP + MySQL)

Diese Anleitung zeigt, wie du die Kleidungsinventar-App auf einem Webserver mit PHP und MySQL (z.B. dogado Webhosting) bereitstellst. Das React-Frontend läuft als statischer Build, die Daten liegen in MySQL und werden über die mitgelieferte PHP-API (`api/`) angesprochen.

## Voraussetzungen

- Node.js (v18 oder höher) auf deinem lokalen Rechner, um das Frontend zu bauen
- dogado-Hosting-Paket (oder anderer Webhoster) mit **PHP 8.x** und **MySQL**
- Zugriff auf deinen Webserver (SSH/SFTP oder das dogado-Kundencenter)
- MySQL-Datenbank in dogado angelegt (Zugangsdaten aus dem Kundencenter)
- Login-Benutzer bereits eingerichtet (siehe SETUP_AUTH.md)

## Schritt 1: App lokal bauen

1. **Stelle sicher, dass alle Dependencies installiert sind:**

```bash
npm install
```

2. **Baue die Production-Version der App:**

```bash
npm run build
```

Dies erstellt einen `dist/` Ordner mit allen optimierten, statischen Dateien.

3. **Teste den Build lokal (optional):**

```bash
npm run preview
```

Die App läuft dann auf http://localhost:4173

## Schritt 2: MySQL-Datenbank einrichten

1. Lege in dogado eine MySQL-Datenbank an (falls noch nicht geschehen) und notiere Host, Datenbankname, Benutzer und Passwort
2. Importiere das Schema per phpMyAdmin oder CLI:
   ```bash
   mysql -u DEIN_DB_USER -p DEIN_DB_NAME < db/schema.sql
   ```
3. Lege den ersten Benutzer an – siehe SETUP_AUTH.md

## Schritt 3: Dateien auf den Server hochladen

Es müssen **zwei Teile** hochgeladen werden: der statische Frontend-Build (`dist/`) und der PHP-Ordner (`api/`).

### Option A: Via SSH/SCP

```bash
# Frontend-Build hochladen
rsync -avz --delete dist/ user@dein-server.de:/var/www/kleidungsinventar/

# PHP-API hochladen (api/config.php wird separat/manuell angelegt, siehe unten)
rsync -avz --exclude 'config.php' --exclude 'uploads/*' api/ user@dein-server.de:/var/www/kleidungsinventar/api/
```

### Option B: Via FTP/SFTP

1. Verbinde dich mit deinem FTP-Client (z.B. FileZilla)
2. Lade **alle Dateien** aus dem `dist/` Ordner in dein Web-Verzeichnis hoch
3. Lade den kompletten `api/`-Ordner in ein Unterverzeichnis `api/` desselben Web-Verzeichnisses hoch (inkl. `.htaccess`-Dateien – FTP-Clients blenden versteckte Dateien manchmal aus, ggf. "versteckte Dateien anzeigen" aktivieren)
4. Erstelle auf dem Server `api/config.php` (Kopie von `api/config.example.php` mit deinen dogado-MySQL-Zugangsdaten) – **niemals `api/config.example.php` mit echten Zugangsdaten committen/hochladen**
5. Stelle sicher, dass `api/uploads/` beschreibbar ist (Rechte i.d.R. 755, je nach dogado-Konfiguration)

### Option C: Via Git + Server-Build

Falls dein Server Node.js hat, kannst du das Frontend auch direkt auf dem Server bauen:

```bash
# Auf dem Server
cd /var/www/kleidungsinventar
git pull
npm install
npm run build
cp api/config.example.php api/config.php   # danach Zugangsdaten eintragen
# Konfiguriere Webserver auf dist/ Ordner, api/ bleibt daneben erreichbar unter /api
```

## Schritt 4: Webserver konfigurieren

### Für nginx

Erstelle oder bearbeite die Konfigurationsdatei (z.B. `/etc/nginx/sites-available/kleidungsinventar`):

```nginx
server {
    listen 80;
    server_name deine-domain.de www.deine-domain.de;

    # Root-Verzeichnis auf dist-Ordner
    root /var/www/kleidungsinventar/dist;
    index index.html;

    # Gzip-Kompression aktivieren
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA: Alle Anfragen auf index.html weiterleiten (außer existierende Dateien)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache für statische Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Sicherheits-Header
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Aktiviere die Konfiguration:**

```bash
# Symlink erstellen
sudo ln -s /etc/nginx/sites-available/kleidungsinventar /etc/nginx/sites-enabled/

# Nginx Konfiguration testen
sudo nginx -t

# Nginx neu laden
sudo systemctl reload nginx
```

### Für Apache

Erstelle eine `.htaccess` Datei im Root-Verzeichnis deiner App (neben index.html):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Wenn die Anfrage KEINE existierende Datei oder Ordner ist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Leite auf index.html um (für SPA-Routing)
  RewriteRule . /index.html [L]
</IfModule>

# Gzip-Kompression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser-Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-font-woff "access plus 1 year"
</IfModule>

# Sicherheits-Header
<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

**Virtual Host Konfiguration (z.B. `/etc/apache2/sites-available/kleidungsinventar.conf`):**

```apache
<VirtualHost *:80>
    ServerName deine-domain.de
    ServerAlias www.deine-domain.de

    DocumentRoot /var/www/kleidungsinventar/dist

    <Directory /var/www/kleidungsinventar/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/kleidungsinventar-error.log
    CustomLog ${APACHE_LOG_DIR}/kleidungsinventar-access.log combined
</VirtualHost>
```

**Aktiviere die Konfiguration:**

```bash
# Module aktivieren
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate

# Site aktivieren
sudo a2ensite kleidungsinventar

# Apache neu starten
sudo systemctl restart apache2
```

**Hinweis zur PHP-API unter Apache:** Die SPA-Rewrite-Regel (`RewriteCond %{REQUEST_FILENAME} !-f`) greift nur, wenn die angefragte Datei nicht existiert. Da `api/*.php` echte Dateien sind, werden Anfragen an `/api/...` normal an PHP durchgereicht und nicht auf `index.html` umgeleitet – es ist keine zusätzliche Konfiguration nötig. Bei dogado ist PHP bereits aktiviert, ein eigenes vHost-Setup ist auf Shared Hosting i.d.R. nicht nötig/möglich (Domain wird im Kundencenter auf das Upload-Verzeichnis gelegt).

## Schritt 5: SSL/HTTPS einrichten (Wichtig!)

**Warum HTTPS wichtig ist:**
- Das Session-Cookie wird in Produktion als `Secure` markiert (`session_cookie_secure` in `api/config.php`) und damit nur über HTTPS übertragen
- Schützt die Login-Daten deiner Familie
- Moderne Browser verlangen HTTPS
- dogado stellt für eigene Domains i.d.R. kostenlose SSL-Zertifikate bereit (Kundencenter → SSL)

### Mit Let's Encrypt (kostenlos)

**Für nginx:**

```bash
# Certbot installieren (Ubuntu/Debian)
sudo apt update
sudo apt install certbot python3-certbot-nginx

# SSL-Zertifikat erstellen und automatisch konfigurieren
sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de
```

**Für Apache:**

```bash
# Certbot installieren
sudo apt update
sudo apt install certbot python3-certbot-apache

# SSL-Zertifikat erstellen
sudo certbot --apache -d deine-domain.de -d www.deine-domain.de
```

Certbot richtet automatisch:
- SSL-Zertifikat ein
- HTTPS-Konfiguration
- HTTP→HTTPS Weiterleitung
- Automatische Verlängerung

## Schritt 6: Domain und DNS konfigurieren

Stelle sicher, dass deine Domain auf deinen Server zeigt:

1. **A-Record** für `deine-domain.de` → Server-IP
2. **A-Record** oder **CNAME** für `www.deine-domain.de` → Server-IP

Die DNS-Änderungen können 1-48 Stunden dauern.

## Schritt 7: Testen

1. Öffne https://deine-domain.de im Browser
2. Teste den Login
3. Prüfe, ob alle Funktionen funktionieren:
   - Personen hinzufügen/bearbeiten/löschen
   - Kleidungsstücke hinzufügen/bearbeiten/löschen
   - Bilder hochladen
   - Logout

## Updates deployen

Wenn du Änderungen an der App vornimmst:

```bash
# Lokal
npm run build

# Upload auf Server (via SSH)
rsync -avz --delete dist/ user@dein-server.de:/var/www/kleidungsinventar/

# Kein Server-Neustart nötig - Browser-Cache eventuell leeren
```

**Tipp:** Nutze ein Deployment-Script:

```bash
#!/bin/bash
# deploy.sh

echo "Building app..."
npm run build

echo "Uploading to server..."
rsync -avz --delete dist/ user@dein-server.de:/var/www/kleidungsinventar/

echo "Deployment complete! 🎉"
echo "Visit: https://deine-domain.de"
```

Nutzung: `chmod +x deploy.sh && ./deploy.sh`

## Troubleshooting

### Problem: "404 Not Found" beim direkten Aufruf einer Unterseite

**Lösung:** SPA-Routing ist nicht konfiguriert. Siehe Webserver-Konfiguration oben.
- nginx: `try_files $uri $uri/ /index.html;`
- Apache: `.htaccess` mit RewriteRule

### Problem: Login funktioniert nicht / "Nicht angemeldet" (401)

**Mögliche Ursachen:**
1. `api/config.php` fehlt oder enthält falsche MySQL-Zugangsdaten
2. Kein Benutzer in der Tabelle `users` angelegt (siehe SETUP_AUTH.md)
3. App läuft über HTTPS, aber `session_cookie_secure` in `api/config.php` steht noch auf `false` (Cookie wird dann evtl. nicht gesetzt) – oder umgekehrt: `true` gesetzt, aber App läuft (noch) über HTTP

**Lösung:**
- Prüfe die Netzwerk-Anfrage an `api/auth/login.php` in den Browser-DevTools auf die genaue Fehlermeldung
- Prüfe PHP-Error-Logs im dogado-Kundencenter

### Problem: Bilder werden nicht angezeigt

**Mögliche Ursachen:**
- `api/uploads/` ist nicht beschreibbar (falsche Dateirechte)
- Benutzer nicht angemeldet (Upload-Endpunkt erfordert Login)
- `api/` wurde nicht mit hochgeladen oder liegt am falschen Pfad

**Lösung:**
- Prüfe, ob du angemeldet bist
- Prüfe Dateirechte von `api/uploads/` (i.d.R. 755)
- Prüfe Browser-Konsole/Netzwerk-Tab auf Fehler bei `api/upload.php`

### Problem: "Server ist nicht konfiguriert" (500)

**Lösung:**
- `api/config.php` fehlt auf dem Server – aus `api/config.example.php` kopieren und mit echten dogado-Zugangsdaten befüllen

## Automatisierung (Optional)

### GitHub Actions für automatisches Deployment

Falls du GitHub nutzt, erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm install

    - name: Build
      run: npm run build

    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@v4
      with:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        SOURCE: "dist/"
        TARGET: "/var/www/kleidungsinventar/"
```

Füge in GitHub → Settings → Secrets die SSH-Keys hinzu.

## Checkliste vor Go-Live

- [ ] MySQL-Datenbank angelegt und `db/schema.sql` importiert
- [ ] App gebaut (`npm run build`)
- [ ] Frontend (`dist/`) und PHP-API (`api/`) auf Server hochgeladen
- [ ] `api/config.php` mit dogado-MySQL-Zugangsdaten angelegt (nicht `config.example.php` verwenden)
- [ ] `session_cookie_secure` auf `true` gesetzt, sobald HTTPS aktiv ist
- [ ] `api/uploads/` beschreibbar
- [ ] Erster Benutzer angelegt (siehe SETUP_AUTH.md), Setup-Skripte danach ggf. wieder entfernt
- [ ] SSL/HTTPS eingerichtet
- [ ] Domain-DNS konfiguriert
- [ ] App getestet (Login, CRUD-Operationen, Bilder)
- [ ] Browser-Cache geleert beim Testen

## Performance-Tipps

1. **Gzip/Brotli-Kompression** aktivieren (siehe Webserver-Config oben)
2. **Browser-Caching** für statische Assets (siehe Config oben)
3. **CDN** vor den Server schalten (z.B. Cloudflare - kostenlos)
4. **HTTP/2** aktivieren (meist automatisch mit SSL)

## Sicherheit

✅ **Bereits implementiert:**
- HTTPS/SSL
- Eigenes Login (bcrypt-gehashte Passwörter, HttpOnly-Session-Cookie)
- API-Endpunkte erfordern eine gültige Session (`require_auth()`)
- Interne PHP-Dateien (`config.php`, `db.php`, `bootstrap.php`, …) per `.htaccess` vor direktem Zugriff geschützt
- Hochgeladene Bilder können nicht als PHP ausgeführt werden
- Sicherheits-Header (X-Frame-Options, etc.)

⚠️ **Zusätzliche Empfehlungen:**
- Regelmäßige Updates von Dependencies: `npm audit`
- `api/setup/generate_password_hash.php` nach der Ersteinrichtung vom Server löschen
- Firewall auf dem Server konfigurieren (falls eigener Server statt Shared Hosting)
- Fail2Ban für Brute-Force-Schutz (bei eigenem Server)
- Regelmäßige Backups der MySQL-Datenbank (dogado-Kundencenter bietet i.d.R. automatische Backups) und von `api/uploads/`

## Support

Bei Problemen:
1. Prüfe Browser-Konsole (F12) auf Fehler
2. Prüfe Server-Logs:
   - nginx: `/var/log/nginx/error.log`
   - Apache: `/var/log/apache2/error.log`
   - dogado: PHP-Error-Logs im Kundencenter
3. Prüfe in phpMyAdmin, ob die Tabellen `users`, `persons`, `clothing` existieren und Daten enthalten
