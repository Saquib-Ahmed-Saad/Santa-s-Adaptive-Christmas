<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($title) ? $title : "Santa's Adaptive Christmas Fifteen Puzzle" ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<header>
    <h1>Santa's Adaptive Christmas Fifteen Puzzle</h1>
    <nav>
        <a href="index.php">Home</a> |
        <a href="game.php">Play</a>
        <button id="theme-toggle" style="float:right;margin-left:2em;">Switch Theme</button>
    </nav>
</header>
<script>
// Theme toggle logic with session persistence
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('theme-toggle');
    function setTheme(theme) {
        document.body.classList.toggle('theme-dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }
    // Load theme from localStorage
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    btn.textContent = saved === 'dark' ? 'Light Theme' : 'Dark Theme';
    btn.onclick = function() {
        const newTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
        setTheme(newTheme);
        btn.textContent = newTheme === 'dark' ? 'Light Theme' : 'Dark Theme';
        // Optionally: send AJAX to save preference in DB
    };
});
</script>
