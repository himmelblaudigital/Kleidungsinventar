<?php
// Browser-basierter Ersatz für api/setup/create_user.php, falls kein SSH/PHP-CLI
// verfügbar ist. Erzeugt nur den Passwort-Hash zum manuellen Eintragen per phpMyAdmin:
//
//   INSERT INTO users (email, password_hash, name)
//   VALUES ('familie@beispiel.de', '<HASH>', 'Familie Mustermann');
//
// WICHTIG: Diese Datei nach der Ersteinrichtung unbedingt vom Server löschen –
// sie ist sonst öffentlich erreichbar.

$hash = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password']) && $_POST['password'] !== '') {
    $hash = password_hash($_POST['password'], PASSWORD_BCRYPT);
}
?>
<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><title>Passwort-Hash erzeugen</title></head>
<body style="font-family: sans-serif; max-width: 640px; margin: 2rem auto;">
  <h1>Passwort-Hash erzeugen</h1>
  <p>Gib das gewünschte Familien-Passwort ein, um den Hash für die <code>users</code>-Tabelle zu erzeugen.</p>
  <form method="post">
    <input type="password" name="password" placeholder="Passwort" required style="padding:.5rem;width:100%;box-sizing:border-box;">
    <button type="submit" style="margin-top:.5rem;padding:.5rem 1rem;">Hash erzeugen</button>
  </form>
  <?php if ($hash): ?>
    <p><strong>Hash:</strong></p>
    <textarea readonly style="width:100%;height:4rem;"><?= htmlspecialchars($hash, ENT_QUOTES) ?></textarea>
    <p>Trage diesen Hash per phpMyAdmin in die Tabelle <code>users</code> ein (Spalte <code>password_hash</code>).</p>
  <?php endif; ?>
  <p style="color:#b00;margin-top:2rem;">⚠️ Diese Datei nach der Einrichtung vom Server löschen!</p>
</body>
</html>
