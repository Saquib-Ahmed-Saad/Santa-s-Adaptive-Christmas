<?php
// Database connection configuration
$host = "localhost";
$user = "pantherID";
$pass = "your_password";
$dbname = "pantherID";

// Create MySQLi connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4 for proper character handling
$conn->set_charset("utf8mb4");

// debugging
echo "Connected successfully to MySQL server version: " . $conn->server_info;
?>