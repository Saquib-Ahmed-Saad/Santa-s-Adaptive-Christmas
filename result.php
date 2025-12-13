<?php
// result.php - Game result and summary
session_start();
$title = "Results - Santa's Adaptive Christmas Fifteen Puzzle";
include 'includes/header.php';
?>
<main>
    <h2>Game Results</h2>
    <!-- Results will be displayed here -->
    <div id="story-mode">
        <h3>Santa's Workshop Story</h3>
        <div id="story-segment">Loading story...</div>
        <button id="next-story-btn">Next Story Segment</button>
    </div>
</main>
<script>
// Example story segments (should be loaded from backend in production)
const storySegments = [
    "Santa's elves are busy preparing gifts for children all over the world.",
    "A snowstorm threatens to delay the sleigh, but teamwork saves the day!",
    "Rudolph's nose lights the way through the darkest winter night.",
    "The final present is wrapped, and Santa takes flight!"
];
let currentSegment = 0;
function showSegment() {
    document.getElementById('story-segment').textContent = storySegments[currentSegment];
}
document.getElementById('next-story-btn').onclick = function() {
    if (currentSegment < storySegments.length - 1) {
        currentSegment++;
        showSegment();
    } else {
        document.getElementById('story-segment').textContent = "Merry Christmas! You've completed the story!";
        this.disabled = true;
    }
};
showSegment();
</script>
<?php include 'includes/footer.php'; ?>
