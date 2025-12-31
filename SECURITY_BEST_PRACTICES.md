# Firebase Security Best Practices

## Aktuelle Sicherheitslage

**Status:** 🔴 **Öffentlicher Zugriff - NUR FÜR ENTWICKLUNG!**

Ihre aktuellen Rules erlauben jedem Lese- und Schreibzugriff. Das ist für lokale Entwicklung OK, aber **NICHT für Produktion**.

## Empfohlene Security Rules (Stufe für Stufe)

### Stufe 1: Basis-Validierung (SOFORT UMSETZEN)

Diese Rules fügen grundlegende Validierung hinzu, ohne Authentifizierung zu benötigen:

#### Firestore Rules (firestore.rules)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Persons Collection
    match /persons/{personId} {
      // Lesen: Öffentlich
      allow read: if true;

      // Schreiben: Mit Validierung
      allow create: if request.resource.data.keys().hasAll(['name', 'avatar', 'kategorie', 'groesse'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 100
        && request.resource.data.avatar is string
        && request.resource.data.kategorie is string
        && request.resource.data.groesse is string;

      allow update: if request.resource.data.keys().hasAll(['name', 'avatar', 'kategorie', 'groesse'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 100;

      allow delete: if true;
    }

    // Clothing Collection
    match /clothing/{clothingId} {
      // Lesen: Öffentlich
      allow read: if true;

      // Schreiben: Mit Validierung
      allow create: if request.resource.data.keys().hasAll(['personId', 'kategorie', 'status'])
        && request.resource.data.kategorie is string
        && request.resource.data.kategorie.size() > 0
        && request.resource.data.kategorie.size() <= 50
        && request.resource.data.status in ['vorhanden', 'zu_klein', 'aussortiert']
        && (!request.resource.data.keys().hasAny(['farbe']) || request.resource.data.farbe.size() <= 50)
        && (!request.resource.data.keys().hasAny(['marke']) || request.resource.data.marke.size() <= 50)
        && (!request.resource.data.keys().hasAny(['groesse']) || request.resource.data.groesse.size() <= 20)
        && (!request.resource.data.keys().hasAny(['notizen']) || request.resource.data.notizen.size() <= 500)
        && (!request.resource.data.keys().hasAny(['imageUrl']) || request.resource.data.imageUrl.size() <= 2048)
        && (!request.resource.data.keys().hasAny(['imagePath']) || request.resource.data.imagePath.size() <= 500);

      allow update: if request.resource.data.kategorie is string
        && request.resource.data.status in ['vorhanden', 'zu_klein', 'aussortiert'];

      allow delete: if true;
    }
  }
}
```

#### Storage Rules (storage.rules)

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /clothing/{personId}/{clothingId}/{fileName} {
      // Lesen: Öffentlich
      allow read: if true;

      // Schreiben: Mit strikter Validierung
      allow write: if request.resource != null
        // Nur Bilder
        && request.resource.contentType.matches('image/.*')
        // Max 5MB
        && request.resource.size < 5 * 1024 * 1024
        // Nur erlaubte Bildformate
        && request.resource.contentType in [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp'
        ]
        // Dateiname muss 'image' enthalten
        && fileName.matches('image\\.(jpg|jpeg|png|gif|webp)');

      // Löschen: Erlaubt
      allow delete: if true;
    }
  }
}
```

**Vorteile:**
- ✅ Verhindert ungültige Daten
- ✅ Begrenzt Dateigröße
- ✅ Verhindert Code-Injection
- ✅ Verhindert zu große Text-Felder (DoS-Schutz)

---

### Stufe 2: Rate Limiting (EMPFOHLEN)

Fügen Sie Firestore-seitige Rate Limits hinzu (erfordert zusätzliche Collection):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: Check rate limit
    function isRateLimited() {
      let clientId = request.auth != null ? request.auth.uid : request.headers['x-client-id'];
      let rateLimit = get(/databases/$(database)/documents/rateLimits/$(clientId));

      return rateLimit != null
        && rateLimit.data.timestamp > request.time - duration.value(1, 'm')
        && rateLimit.data.count > 100;
    }

    match /persons/{personId} {
      allow read: if true;
      allow create, update: if !isRateLimited()
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 100;
      allow delete: if !isRateLimited();
    }

    match /clothing/{clothingId} {
      allow read: if true;
      allow create, update: if !isRateLimited()
        && request.resource.data.kategorie is string
        && request.resource.data.status in ['vorhanden', 'zu_klein', 'aussortiert'];
      allow delete: if !isRateLimited();
    }
  }
}
```

**Hinweis:** Erfordert Client-seitige Implementierung zum Tracken der Rate Limits.

---

### Stufe 3: Mit Firebase Authentication (FÜR PRODUKTION)

Die sicherste Lösung - nur angemeldete Benutzer haben Zugriff:

#### Firestore Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Persons Collection - Nur für angemeldete Benutzer
    match /persons/{personId} {
      allow read: if request.auth != null;

      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid  // Benutzer kann nur eigene Personen erstellen
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 100;

      allow update: if request.auth != null
        && resource.data.userId == request.auth.uid;  // Nur eigene Personen bearbeiten

      allow delete: if request.auth != null
        && resource.data.userId == request.auth.uid;  // Nur eigene Personen löschen
    }

    // Clothing Collection - Nur für angemeldete Benutzer
    match /clothing/{clothingId} {
      allow read: if request.auth != null
        && get(/databases/$(database)/documents/persons/$(resource.data.personId)).data.userId == request.auth.uid;

      allow create: if request.auth != null
        && get(/databases/$(database)/documents/persons/$(request.resource.data.personId)).data.userId == request.auth.uid
        && request.resource.data.kategorie is string
        && request.resource.data.status in ['vorhanden', 'zu_klein', 'aussortiert'];

      allow update: if request.auth != null
        && get(/databases/$(database)/documents/persons/$(resource.data.personId)).data.userId == request.auth.uid;

      allow delete: if request.auth != null
        && get(/databases/$(database)/documents/persons/$(resource.data.personId)).data.userId == request.auth.uid;
    }
  }
}
```

#### Storage Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /clothing/{personId}/{clothingId}/{fileName} {
      // Lesen: Nur eigene Bilder
      allow read: if request.auth != null
        && request.auth.uid == getPersonOwner(personId);

      // Schreiben: Nur eigene Bilder
      allow write: if request.auth != null
        && request.auth.uid == getPersonOwner(personId)
        && request.resource.contentType.matches('image/.*')
        && request.resource.size < 5 * 1024 * 1024;

      // Löschen: Nur eigene Bilder
      allow delete: if request.auth != null
        && request.auth.uid == getPersonOwner(personId);
    }

    // Helper function
    function getPersonOwner(personId) {
      return firestore.get(/databases/(default)/documents/persons/$(personId)).data.userId;
    }
  }
}
```

**Vorteile:**
- ✅ Nur angemeldete Benutzer
- ✅ Benutzer sehen nur eigene Daten
- ✅ Multi-Benutzer-fähig
- ✅ Produktionsreif

**Erfordert:**
- Firebase Authentication Setup
- Login/Signup UI
- App-Code-Anpassungen (userId in Daten speichern)

---

## Zusätzliche Sicherheitsmaßnahmen

### 1. App Check (SEHR EMPFOHLEN)

Schützt vor Bot-Traffic und Missbrauch:

```javascript
// In den Rules (Firestore & Storage)
allow read: if request.auth != null && request.app != null;
```

**Setup:**
1. Firebase Console → App Check aktivieren
2. ReCAPTCHA für Web konfigurieren
3. SDK in App integrieren

### 2. Content Security Policy (CSP)

Fügen Sie zu `index.html` hinzu:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               img-src 'self' https://firebasestorage.googleapis.com;
               script-src 'self' 'unsafe-inline' https://www.gstatic.com;
               style-src 'self' 'unsafe-inline';">
```

### 3. Firestore Security Rules Testing

Testen Sie Ihre Rules in der Firebase Console:

```javascript
// Beispiel-Test
match /persons/testDoc {
  allow read: if request.auth != null;
}

// Test in Console: Rules Playground
```

---

## Schritt-für-Schritt Migration (Empfehlung)

**Jetzt (Entwicklung):**
- ✅ Aktuelle öffentliche Rules beibehalten
- ✅ Entwickeln und Testen

**Vor dem ersten Deployment:**
- 🔄 Stufe 1 Rules implementieren (Basis-Validierung)
- 🔄 Storage Rules mit Validierung deployen

**Für Produktion:**
- 🔜 Firebase Authentication hinzufügen
- 🔜 Stufe 3 Rules implementieren (mit Auth)
- 🔜 App Check aktivieren

---

## Firebase Console Links

- **Firestore Rules:** https://console.firebase.google.com/project/kleidungsinventar/firestore/rules
- **Storage Rules:** https://console.firebase.google.com/project/kleidungsinventar/storage/rules
- **App Check:** https://console.firebase.google.com/project/kleidungsinventar/appcheck

---

## Monitoring & Alerts

Aktivieren Sie in der Firebase Console:

1. **Firestore Usage Monitoring**
   - Überwachen Sie Lese-/Schreiboperationen
   - Setzen Sie Budgets

2. **Storage Usage Monitoring**
   - Überwachen Sie Upload-Größen
   - Setzen Sie Quotas

3. **Authentication Monitoring** (wenn aktiviert)
   - Überwachen Sie Login-Versuche
   - Spam-Erkennung

---

## Checkliste

**Sofort:**
- [ ] Storage Rules mit Basis-Validierung deployen (siehe oben)
- [ ] Firestore Rules mit Datenvalidierung deployen

**Vor Produktion:**
- [ ] Firebase Authentication implementieren
- [ ] Auth-basierte Rules deployen
- [ ] App Check aktivieren
- [ ] CSP Headers hinzufügen

**Optional:**
- [ ] Rate Limiting implementieren
- [ ] Monitoring & Alerts einrichten
- [ ] Budget-Limits setzen

---

## Hilfreiche Ressourcen

- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
- [Firestore Security Best Practices](https://firebase.google.com/docs/firestore/security/overview)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [App Check Documentation](https://firebase.google.com/docs/app-check)
