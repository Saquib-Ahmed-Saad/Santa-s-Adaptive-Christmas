<?php
// User registration endpoint
require_once '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    if (strlen($username) < 3 || strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT user_id FROM users WHERE username = ?');
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        echo json_encode(['status' => 'error', 'message' => 'Username already exists.']);
        exit;
    }
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    $stmt->execute([$username, $hash]);
    echo json_encode(['status' => 'success']);
    exit;
}
echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
