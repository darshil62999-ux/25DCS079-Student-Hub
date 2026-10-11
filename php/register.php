<?php
require_once __DIR__ . "/db_mysqli.php";

$message = "";
$success = false;

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../register.html");
    exit;
}

$fullname = trim($_POST["fullname"] ?? "");
$username = trim($_POST["username"] ?? "");
$email = strtolower(trim($_POST["email"] ?? ""));
$password = $_POST["password"] ?? "";
$confirmPassword = $_POST["confirm-password"] ?? "";
$role = $_POST["role"] ?? "";
$terms = isset($_POST["terms"]);

if ($fullname === "" || mb_strlen($fullname) > 100) {
    $message = "Enter a valid full name.";

} elseif (!preg_match('/^[A-Za-z0-9_]{3,30}$/', $username)) {
    $message = "Username must be 3–30 letters, numbers or underscores.";

} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)
          || strlen($email) > 254) {
    $message = "Enter a valid email address.";

} elseif (strlen($password) < 8) {
    $message = "Password must contain at least 8 characters.";

} elseif ($password !== $confirmPassword) {
    $message = "Passwords do not match.";

} elseif (!in_array($role, ["student", "faculty"], true)) {
    $message = "Select a valid role.";

} elseif (!$terms) {
    $message = "Accept the terms and conditions.";

} else {
    try {
        // Check duplicate email or username.
        $check = $conn->prepare(
            "SELECT id FROM users
             WHERE email = ? OR username = ?"
        );

        $check->bind_param("ss", $email, $username);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $message = "Email or username already exists.";

        } else {
            // Hash the password before storing it.
            $hashedPassword = password_hash(
                $password,
                PASSWORD_DEFAULT
            );

            // Insert user using a prepared statement.
            $stmt = $conn->prepare(
                "INSERT INTO users
                (fullname, username, email, password_hash, role)
                VALUES (?, ?, ?, ?, ?)"
            );

            $stmt->bind_param(
                "sssss",
                $fullname,
                $username,
                $email,
                $hashedPassword,
                $role
            );

            $stmt->execute();

            $message = "Registration successful!";
            $success = true;

            $stmt->close();
        }

        $check->close();

    } catch (mysqli_sql_exception $e) {
        error_log($e->getMessage());
        $message = "Registration failed. Please try again.";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Registration Status</title>
</head>
<body>

    <h1>Registration Status</h1>

    <p role="status">
        <?php
        echo htmlspecialchars(
            $message,
            ENT_QUOTES,
            "UTF-8"
        );
        ?>
    </p>

    <?php if ($success): ?>
        <a href="../login.html">Go to Login</a>
    <?php else: ?>
        <a href="../register.html">Try Again</a>
    <?php endif; ?>

</body>
</html>
