# Firestore Setup Anleitung

## 1. Firebase Konfiguration hinzufügen

Öffnen Sie die Datei `src/firebase/config.js` und ersetzen Sie die Platzhalter-Werte mit Ihrer echten Firebase-Konfiguration:

1. Gehen Sie zur [Firebase Console](https://console.firebase.google.com/)
2. Wählen Sie Ihr Projekt aus
3. Klicken Sie auf ⚙️ (Einstellungen) → Projekteinstellungen
4. Scrollen Sie zu "Ihre Apps" → wählen Sie Web-App (</>)
5. Kopieren Sie die `firebaseConfig`
6. Fügen Sie diese in `src/firebase/config.js` ein

## 2. Firestore Security Rules einrichten

Die Security Rules befinden sich in der Datei `firestore.rules`.

### Option A: Öffentliche DB (Aktuell aktiv - NUR FÜR ENTWICKLUNG!)
```bash
firebase deploy --only firestore:rules
```

**WARNUNG:** Diese Regeln erlauben jedem Lese- und Schreibzugriff!

### Option B: Regeln über Firebase Console einfügen

1. Gehen Sie zur [Firebase Console](https://console.firebase.google.com/)
2. Wählen Sie Ihr Projekt
3. Navigieren Sie zu **Firestore Database**
4. Klicken Sie auf den Tab **Regeln**
5. Kopieren Sie den Inhalt aus `firestore.rules`
6. Fügen Sie ihn ein und klicken Sie auf **Veröffentlichen**

## 3. Firestore Datenbank erstellen (falls noch nicht geschehen)

1. Firebase Console → Firestore Database
2. Klicken Sie auf **Datenbank erstellen**
3. Wählen Sie **Produktionsmodus** starten
4. Wählen Sie einen Standort (z.B. europe-west3)
5. Klicken Sie auf **Aktivieren**

## 4. Vorhandene LocalStorage-Daten migrieren (Optional)

Wenn Sie bereits Daten in LocalStorage haben:

1. Öffnen Sie die Browser-Konsole (F12)
2. Führen Sie folgenden Code aus:

```javascript
// LocalStorage-Daten abrufen
const persons = JSON.parse(localStorage.getItem('kleidungsinventar_persons') || '[]')
const clothing = JSON.parse(localStorage.getItem('kleidungsinventar_clothing') || '[]')

console.log('Persons:', persons)
console.log('Clothing:', clothing)

// Diese Daten können Sie manuell in Firestore importieren
// oder Sie fügen sie über die App neu hinzu
```

3. Fügen Sie die Daten über die App neu hinzu

## 5. Funktionen testen

Nach dem Setup können Sie:
- ✅ Personen hinzufügen → werden in Firestore gespeichert
- ✅ Kleidung hinzufügen → wird in Firestore gespeichert
- ✅ Echtzeit-Sync → Änderungen erscheinen sofort
- ✅ Multi-Device → Öffnen Sie die App auf mehreren Geräten

## 6. Firestore Collections

Ihre Datenbank sollte diese Collections haben:

```
/persons
  /{personId}
    - name: string
    - avatar: string
    - kategorie: string
    - groesse: string

/clothing
  /{clothingId}
    - personId: string
    - kategorie: string
    - farbe: string
    - marke: string
    - groesse: string
    - status: string
    - notizen: string
```

## Troubleshooting

### Fehler: "Missing or insufficient permissions"
→ Überprüfen Sie die Firestore Security Rules

### Fehler: "Firebase: No Firebase App '[DEFAULT]' has been created"
→ Überprüfen Sie die Config in `src/firebase/config.js`

### Daten werden nicht angezeigt
1. Öffnen Sie die Browser-Konsole (F12)
2. Prüfen Sie auf Fehlermeldungen
3. Überprüfen Sie die Firestore Console, ob Daten vorhanden sind

### App lädt endlos
→ Firestore ist möglicherweise nicht initialisiert. Prüfen Sie die Config und Regeln.
