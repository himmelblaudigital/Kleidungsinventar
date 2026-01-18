# Login-System Einrichtung

## Übersicht

Die App ist jetzt mit einem sicheren Login-System ausgestattet, das Firebase Authentication verwendet. Nur authentifizierte Benutzer haben Zugriff auf die Daten.

## Schritte zur Einrichtung

### 1. Firebase Authentication aktivieren

1. Gehe zur [Firebase Console](https://console.firebase.google.com/)
2. Wähle dein Projekt "kleidungsinventar" aus
3. Navigiere zu **Authentication** im linken Menü
4. Klicke auf **Get Started** (falls noch nicht aktiviert)
5. Wähle **Sign-in method** (Anmeldemethode)
6. Aktiviere **Email/Password**:
   - Klicke auf "Email/Password"
   - Schalte den ersten Toggle auf "Enable" (Aktiviert)
   - Speichern

### 2. Ersten Benutzer anlegen

1. In der Firebase Console unter **Authentication**
2. Gehe zum Tab **Users**
3. Klicke auf **Add User**
4. Gib deine Familien-Email ein (z.B. `familie@example.com`)
5. Wähle ein **starkes Passwort** (mindestens 8 Zeichen)
6. Speichere die Zugangsdaten sicher!

**Empfehlung:** Verwende einen Passwort-Manager für das Familienpasswort.

### 3. Security Rules deployen

Die aktualisierten Security Rules müssen in Firebase deployed werden:

```bash
# Falls Firebase CLI noch nicht installiert ist:
npm install -g firebase-tools

# Login bei Firebase
firebase login

# Security Rules deployen
firebase deploy --only firestore:rules,storage
```

**Wichtig:** Nach dem Deployment haben nur noch authentifizierte Benutzer Zugriff auf die Daten!

### 4. App testen

1. Starte die App: `npm run dev`
2. Du solltest jetzt einen Login-Bildschirm sehen
3. Melde dich mit der angelegten Email und dem Passwort an
4. Nach erfolgreicher Anmeldung siehst du das Dashboard
5. Teste den Logout-Button (rechts oben)

## Sicherheitshinweise

✅ **Was ist jetzt sicher:**
- Nur authentifizierte Benutzer haben Zugriff auf Firestore-Daten
- Nur authentifizierte Benutzer können Bilder hochladen/löschen
- Session bleibt nach Browser-Neustart erhalten (LocalStorage)
- Passwort wird sicher von Firebase gehasht

⚠️ **Wichtig zu wissen:**
- Dies ist ein **gemeinsamer Account** für die ganze Familie
- Alle angemeldeten Personen haben **volle Zugriffs- und Löschrechte**
- Es gibt keine Rollen oder Berechtigungen pro Person im Haushalt
- Die App ist öffentlich zugänglich, aber nur mit Passwort nutzbar

## Passwort vergessen?

Falls du das Passwort vergessen hast:

1. Gehe zur [Firebase Console](https://console.firebase.google.com/)
2. Navigiere zu **Authentication** → **Users**
3. Finde deinen Benutzer und klicke auf das Menü (⋮)
4. Wähle **Reset password**
5. Du erhältst eine Email mit einem Link zum Zurücksetzen

## Zusätzliche Sicherheitsmaßnahmen (Optional)

### Passwort-Richtlinien

Firebase Auth erzwingt standardmäßig:
- Mindestens 6 Zeichen (besser: 12+ Zeichen)
- Empfohlen: Kombination aus Buchstaben, Zahlen und Sonderzeichen

### Email-Verifizierung (Optional)

Falls du Email-Verifizierung aktivieren möchtest:
1. Firebase Console → Authentication → Templates
2. Passe die Email-Templates an (optional auf Deutsch)

## Troubleshooting

### Fehler: "Missing or insufficient permissions"
- Stelle sicher, dass die Security Rules deployed wurden
- Prüfe, ob du angemeldet bist (schaue in den Browser DevTools → Application → Local Storage)

### Login funktioniert nicht
- Überprüfe Email und Passwort auf Tippfehler
- Prüfe, ob der Benutzer in Firebase Console → Authentication → Users existiert
- Schaue in die Browser-Konsole nach Fehlermeldungen

### App lädt ewig
- Prüfe deine Internetverbindung
- Schaue in die Browser-Konsole nach Fehlern
- Stelle sicher, dass Firebase korrekt konfiguriert ist

## Support

Bei Problemen:
1. Prüfe die Browser-Konsole auf Fehlermeldungen
2. Prüfe die Firebase Console auf Fehler
3. Stelle sicher, dass alle Schritte oben ausgeführt wurden
