<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request.");
}

// Get form data
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$mobile = trim($_POST["mobile"] ?? "");
$course = trim($_POST["course"] ?? "");
$year = trim($_POST["year"] ?? "");
$gender = trim($_POST["gender"] ?? "");
$message = trim($_POST["message"] ?? "");

// Server-side validation
$errors = [];

if ($name === "" || strlen($name) < 3) {
    $errors[] = "Invalid name.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email address.";
}

if (!preg_match("/^[6-9][0-9]{9}$/", $mobile)) {
    $errors[] = "Invalid mobile number.";
}

if ($course === "") {
    $errors[] = "Please select a course.";
}

if ($year === "") {
    $errors[] = "Please select your year.";
}

if ($gender === "") {
    $errors[] = "Please select your gender.";
}

// If validation errors exist
if (!empty($errors)) {

    echo "<h2>Registration Failed</h2>";

    echo "<ul>";

    foreach ($errors as $error) {
        echo "<li>" . htmlspecialchars($error) . "</li>";
    }

    echo "</ul>";

    echo '<a href="register.html">Go Back</a>';

    exit;
}

// Sanitize data
$name = htmlspecialchars($name, ENT_QUOTES, "UTF-8");
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$mobile = htmlspecialchars($mobile, ENT_QUOTES, "UTF-8");
$course = htmlspecialchars($course, ENT_QUOTES, "UTF-8");
$year = htmlspecialchars($year, ENT_QUOTES, "UTF-8");
$gender = htmlspecialchars($gender, ENT_QUOTES, "UTF-8");
$message = htmlspecialchars($message, ENT_QUOTES, "UTF-8");

// CSV file
$file = "../csv/registrations.csv";

// Check whether file is new
$isNewFile = !file_exists($file);

// Open CSV file
$handle = fopen($file, "a");

if ($handle === false) {
    die("Error: Unable to open storage file.");
}

// Add header if file is new
if ($isNewFile) {

    fputcsv($handle, [
        "Name",
        "Email",
        "Mobile",
        "Course",
        "Year",
        "Gender",
        "Message"
    ]);
}

// Add student record
fputcsv($handle, [
    $name,
    $email,
    $mobile,
    $course,
    $year,
    $gender,
    $message
]);

fclose($handle);

// Success message
echo "<h2>Registration Successful!</h2>";

echo "<p>Your registration has been submitted successfully.</p>";

echo '<a href="register.html">Register Another Student</a>';

?>