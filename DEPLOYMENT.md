# Deployment-Anleitung für eigenen Server

Diese Anleitung zeigt, wie du die Kleidungsinventar-App auf deinem eigenen Webserver bereitstellst.

## Voraussetzungen

- Node.js (v18 oder höher) auf deinem lokalen Rechner
- Zugriff auf deinen Webserver (SSH, FTP, oder Web-Interface)
- Webserver mit nginx, Apache oder ähnlich
- Firebase Authentication & Security Rules bereits eingerichtet (siehe SETUP_AUTH.md)

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

## Schritt 2: Dateien auf den Server hochladen

### Option A: Via SSH/SCP

```bash
# Gesamten dist Ordner hochladen
scp -r dist/* user@dein-server.de:/var/www/kleidungsinventar/

# Oder mit rsync (empfohlen, da effizienter)
rsync -avz --delete dist/ user@dein-server.de:/var/www/kleidungsinventar/
```

### Option B: Via FTP/SFTP

1. Verbinde dich mit deinem FTP-Client (z.B. FileZilla)
2. Lade **alle Dateien** aus dem `dist/` Ordner in dein Web-Verzeichnis hoch
3. Achte darauf, dass die Ordnerstruktur erhalten bleibt

### Option C: Via Git + Server-Build

Falls dein Server Node.js hat, kannst du auch direkt auf dem Server bauen:

```bash
# Auf dem Server
cd /var/www/kleidungsinventar
git pull
npm install
npm run build
# Konfiguriere Webserver auf dist/ Ordner
```

## Schritt 3: Webserver konfigurieren

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

## Schritt 4: SSL/HTTPS einrichten (Wichtig!)

**Warum HTTPS wichtig ist:**
- Firebase Authentication funktioniert nur über HTTPS (außer localhost)
- Schützt die Login-Daten deiner Familie
- Moderne Browser verlangen HTTPS

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

## Schritt 5: Domain und DNS konfigurieren

Stelle sicher, dass deine Domain auf deinen Server zeigt:

1. **A-Record** für `deine-domain.de` → Server-IP
2. **A-Record** oder **CNAME** für `www.deine-domain.de` → Server-IP

Die DNS-Änderungen können 1-48 Stunden dauern.

## Schritt 6: Testen

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

### Problem: Firebase Auth funktioniert nicht

**Mögliche Ursachen:**
1. App läuft nicht über HTTPS
2. Domain ist nicht in Firebase Console als autorisierte Domain eingetragen

**Lösung:**
- Stelle sicher, dass SSL/HTTPS konfiguriert ist
- Gehe zu Firebase Console → Authentication → Settings → Authorized domains
- Füge deine Domain hinzu (z.B. `deine-domain.de`)

### Problem: Bilder werden nicht angezeigt

**Mögliche Ursachen:**
- CORS-Probleme
- Benutzer nicht angemeldet
- Storage Rules nicht deployed

**Lösung:**
- Prüfe, ob du angemeldet bist
- Deploye Storage Rules: `firebase deploy --only storage`
- Prüfe Browser-Konsole auf Fehler

### Problem: "Firebase: Error (auth/unauthorized-domain)"

**Lösung:**
- Gehe zu Firebase Console → Authentication → Settings → Authorized domains
- Füge deine Domain hinzu (ohne https://)

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

- [ ] App gebaut (`npm run build`)
- [ ] Dateien auf Server hochgeladen
- [ ] Webserver konfiguriert (nginx/Apache)
- [ ] SSL/HTTPS eingerichtet
- [ ] Domain-DNS konfiguriert
- [ ] Firebase Authentication aktiviert
- [ ] Benutzer in Firebase angelegt
- [ ] Security Rules deployed (`firebase deploy --only firestore:rules,storage`)
- [ ] Domain in Firebase Authorized Domains eingetragen
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
- Firebase Authentication
- Firestore Security Rules
- Storage Security Rules
- Sicherheits-Header (X-Frame-Options, etc.)

⚠️ **Zusätzliche Empfehlungen:**
- Regelmäßige Updates von Dependencies: `npm audit`
- Firewall auf dem Server konfigurieren
- Fail2Ban für Brute-Force-Schutz
- Regelmäßige Backups der Firebase-Daten

## Support

Bei Problemen:
1. Prüfe Browser-Konsole (F12) auf Fehler
2. Prüfe Server-Logs:
   - nginx: `/var/log/nginx/error.log`
   - Apache: `/var/log/apache2/error.log`
3. Prüfe Firebase Console auf Fehler/Limits
