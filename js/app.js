import { setupIcons, setActiveIcon } from "./ui.js";

// Initialize icons
setupIcons();

// Navigation handling
const buttons = document.querySelectorAll(".tab-bar button");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Update active icon
    setActiveIcon(btn);

    // Switch screen
    const screenId = btn.dataset.screen;
    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
  });
});
