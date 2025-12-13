<?php
// User login endpoint
require_once '../includes/db.php';
require_once '../includes/session.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $stmt = $pdo->prepare('SELECT user_id, password_hash FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['user_id'];
        echo json_encode(['status' => 'success']);
        exit;
    }
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials.']);
    exit;
}
echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
