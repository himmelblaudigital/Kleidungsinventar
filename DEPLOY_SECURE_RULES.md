# Sichere Firebase Rules Deployen

## Übersicht

Ich habe verbesserte Security Rules mit Basis-Validierung für Sie erstellt:
- ✅ `firestore.rules.secure` - Firestore Rules mit Datenvalidierung
- ✅ `storage.rules.secure` - Storage Rules mit Bildvalidierung

Diese Rules sind **sicherer als die aktuellen**, benötigen aber **keine Authentifizierung**.

---

## Was die neuen Rules schützen

### Firestore (firestore.rules.secure):
- ✅ Validiert alle Pflichtfelder
- ✅ Begrenzt Text-Längen (verhindert DoS-Attacken)
- ✅ Erlaubt nur gültige Status-Werte
- ✅ Verhindert Code-Injection
- ✅ Validiert Datentypen

### Storage (storage.rules.secure):
- ✅ Nur Bilder erlaubt (keine PDFs, Videos, etc.)
- ✅ Max 5MB pro Bild
- ✅ Nur sichere Formate: JPEG, PNG, GIF, WebP
- ✅ Korrekte Dateinamen erforderlich
- ✅ Blockiert alle anderen Pfade

---

## Deployment-Optionen

### Option 1: Firebase Console (Einfach, Empfohlen)

#### Firestore Rules:
1. Öffnen Sie [Firestore Rules](https://console.firebase.google.com/project/kleidungsinventar/firestore/rules)
2. Öffnen Sie die Datei `firestore.rules.secure` in einem Editor
3. Kopieren Sie den gesamten Inhalt
4. Fügen Sie ihn in das Rules-Feld ein (ersetzt die aktuellen Rules)
5. Klicken Sie auf **Veröffentlichen**

#### Storage Rules:
1. Öffnen Sie [Storage Rules](https://console.firebase.google.com/project/kleidungsinventar/storage/rules)
2. Öffnen Sie die Datei `storage.rules.secure` in einem Editor
3. Kopieren Sie den gesamten Inhalt
4. Fügen Sie ihn in das Rules-Feld ein
5. Klicken Sie auf **Veröffentlichen**

---

### Option 2: Firebase CLI (Fortgeschritten)

```bash
# 1. Installieren Sie Firebase CLI (falls noch nicht geschehen)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialisieren Sie Firebase in Ihrem Projekt
firebase init

# Wählen Sie:
# - Firestore
# - Storage
# - Bestehendes Projekt: kleidungsinventar

# 4. Ersetzen Sie die generierten Dateien mit den sicheren Versionen
cp firestore.rules.secure firestore.rules
cp storage.rules.secure storage.rules

# 5. Deployen
firebase deploy --only firestore:rules,storage:rules
```

---

## Nach dem Deployment testen

1. **Öffnen Sie die App** (http://localhost:5173)
2. **Testen Sie normale Operationen:**
   - ✅ Person hinzufügen (sollte funktionieren)
   - ✅ Kleidung hinzufügen (sollte funktionieren)
   - ✅ Bild hochladen (sollte funktionieren)

3. **Testen Sie ungültige Operationen:**
   - ❌ Versuchen Sie, eine Person ohne Namen zu erstellen (sollte fehlschlagen)
   - ❌ Versuchen Sie, ein >5MB Bild hochzuladen (sollte fehlschlagen)
   - ❌ Versuchen Sie, eine PDF hochzuladen (sollte fehlschlagen)

---

## Unterschiede zu aktuellen Rules

**Aktuell (firestore.rules):**
```javascript
allow read, write: if true;  // ❌ Komplett offen
```

**Neu (firestore.rules.secure):**
```javascript
allow read: if true;  // ✅ Lesen weiterhin öffentlich

allow create: if request.resource.data.name is string  // ✅ Validierung
  && request.resource.data.name.size() > 0
  && request.resource.data.name.size() <= 100;
```

---

## Rollback (falls etwas nicht funktioniert)

Falls nach dem Deployment etwas nicht funktioniert:

1. Gehen Sie zur [Firebase Console](https://console.firebase.google.com/project/kleidungsinventar/firestore/rules)
2. Klicken Sie auf **Versionen** / **Versions**
3. Wählen Sie die vorherige Version
4. Klicken Sie auf **Wiederherstellen** / **Restore**

---

## Nächste Schritte (für später)

Wenn Sie bereit für Produktion sind:

1. **Firebase Authentication hinzufügen:**
   - Siehe `SECURITY_BEST_PRACTICES.md` - Stufe 3
   - Nur angemeldete Benutzer haben Zugriff
   - Benutzer sehen nur eigene Daten

2. **App Check aktivieren:**
   - Schützt vor Bot-Traffic
   - Siehe `SECURITY_BEST_PRACTICES.md`

3. **Monitoring einrichten:**
   - Überwachen Sie Usage
   - Setzen Sie Budgets

---

## Empfehlung

**Für Entwicklung/Test:**
✅ Deployen Sie die `.secure` Rules **jetzt**
- Sie behalten öffentlichen Zugriff
- Aber mit grundlegender Validierung
- Verhindert die meisten Angriffe

**Für Produktion:**
🔜 Implementieren Sie Authentication
- Siehe `SECURITY_BEST_PRACTICES.md`
- Stufe 3 Rules

---

## Fragen?

- 📖 Vollständige Anleitung: `SECURITY_BEST_PRACTICES.md`
- 🔗 Firebase Docs: https://firebase.google.com/docs/rules
- 💬 Firebase Support: https://firebase.google.com/support
