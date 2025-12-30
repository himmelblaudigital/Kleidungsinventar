# Firebase Storage Security Rules Setup

## Wichtig: Bitte diese Rules in der Firebase Console konfigurieren!

Die Bild-Upload-Funktion ist jetzt vollständig implementiert. Damit sie funktioniert, müssen Sie die Firebase Storage Security Rules in der Firebase Console konfigurieren.

## Anleitung

1. Öffnen Sie die [Firebase Console](https://console.firebase.google.com/project/kleidungsinventar/storage)

2. Navigieren Sie zu **Storage** in der linken Seitenleiste

3. Klicken Sie auf den Tab **Rules** (Regeln)

4. Kopieren Sie die folgenden Rules und fügen Sie sie ein:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /clothing/{personId}/{clothingId}/{fileName} {
      // Öffentlicher Lesezugriff für alle Bilder
      allow read: if true;

      // Schreibzugriff nur für Bilder unter 5MB und nur Bildformate
      allow write: if true
        && request.resource.size < 5 * 1024 * 1024  // Max 5MB
        && request.resource.contentType.matches('image/.*');  // Nur Bilder
    }
  }
}
```

5. Klicken Sie auf **Veröffentlichen** (Publish)

## Was diese Rules bewirken

- **Lesezugriff**: Alle können Bilder sehen (öffentlich)
- **Schreibzugriff**:
  - Nur Bilder dürfen hochgeladen werden
  - Maximale Dateigröße: 5MB
  - Bilder werden in der Struktur `clothing/{personId}/{clothingId}/image.jpg` gespeichert

## Wichtig für Produktion

Die aktuellen Rules erlauben **öffentlichen Zugriff** ohne Authentifizierung. Das ist für Entwicklung/Test in Ordnung.

**Für Produktion sollten Sie:**
- Firebase Authentication hinzufügen
- Rules anpassen, um nur authentifizierten Benutzern Zugriff zu gewähren:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /clothing/{personId}/{clothingId}/{fileName} {
      // Nur authentifizierte Benutzer können lesen
      allow read: if request.auth != null;

      // Nur authentifizierte Benutzer können schreiben
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Testen

Nach dem Deployment der Rules können Sie:
1. In der App ein Kleidungsstück erstellen
2. Ein Bild hochladen (vom Gerät oder Kamera)
3. Das Bild sollte in der ClothingCard angezeigt werden
4. Im Storage-Tab der Firebase Console sollten Sie die hochgeladenen Bilder sehen
