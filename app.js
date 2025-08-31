function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show the one we clicked
  document.getElementById(screenId).classList.add('active');
}
