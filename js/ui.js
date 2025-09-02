import { ICONS } from "./constants.js";

// Create SVG icons
export function createIcons(paths) {
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

// Attach icons to nav buttons
export function setupIcons() {
  document.getElementById("home-btn").appendChild(createIcons(ICONS.home));
  document.getElementById("calendar-btn").appendChild(createIcons(ICONS.calendar));
  document.getElementById("stats-btn").appendChild(createIcons(ICONS.chart));
  document.getElementById("profile-btn").appendChild(createIcons(ICONS.profile));

  // Default: activate home
  document.querySelector("#home-btn .tab-bar-icon").classList.add("active");
}

// Handle active state for icons
export function setActiveIcon(button) {
  document.querySelectorAll(".tab-bar-icon").forEach(icon => {
    icon.classList.remove("active");
  });

  const icon = button.querySelector(".tab-bar-icon");
  if (icon) icon.classList.add("active");
}
