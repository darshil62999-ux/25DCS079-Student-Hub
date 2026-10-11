
<?php
require_once "db.php";

echo "<h2>StudentHub Database Connection</h2>";
echo "<p>Database connected successfully!</p>";

$tables = ["students", "events", "registrations"];

foreach ($tables as $table) {
    $stmt = $pdo->query("SELECT COUNT(*) FROM " . $table);
    $count = $stmt->fetchColumn();

    echo "<p>" . ucfirst($table) .
         ": " . $count . " records</p>";
}
?>
