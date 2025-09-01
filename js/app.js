import { ICONS } from "./constants.js";

function createIcons(paths) {
  console.log(ICONS)
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.classList.add("tab-bar-icon");

  paths.forEach(p => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", p);
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");
    svg.appendChild(path);
  });

  return svg;
}

// Attach icons
document.getElementById("home-btn").appendChild(createIcons(ICONS.home));
document.getElementById("calendar-btn").appendChild(createIcons(ICONS.calendar));
document.getElementById("stats-btn").appendChild(createIcons(ICONS.chart));
document.getElementById("profile-btn").appendChild(createIcons(ICONS.profile));

// Set home icon to active by default
document.querySelector("#home-btn .tab-bar-icon").classList.add("active");

// Navigation handling
const buttons = document.querySelectorAll(".tab-bar button");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Reset all icons
    document.querySelectorAll(".tab-bar-icon").forEach(icon => {
      icon.classList.remove("active");
    });

    // Activate this icon
    const icon = btn.querySelector(".tab-bar-icon");
    if (icon) icon.classList.add("active");

    // Switch screen
    const screenId = btn.dataset.screen;
    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
  });
});
