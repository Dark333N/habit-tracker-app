import { ICONS } from "./constants.js";
import { getHabitsForDays } from "./database.js";

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


// Render the habits

export async function renderHabits(days) {

    const container = document.getElementById("habits-container");
    container.innerHTML = "";

    const habitsByDay = await getHabitsForDays(days);
    for (const dayKey of days) {
        const habits = habitsByDay[dayKey];

        const daySection = document.createElement("div");
        daySection.className = "day-section"

        const title = document.createElement("div");
        title.className = "day-title";
        title.textContent = dayKey;
        daySection.appendChild(title);

        habits.forEach(h => {
            const habitCard = document.createElement("div");
            habitCard.className = "habit-card";

            // creating picture div
            const pictureDiv = document.createElement("div");
            pictureDiv.className = "habit-picture-div";

            console.log(h.picture, typeof h.picture)

            if (h.picture instanceof Blob || h.picture instanceof File) {
                const img = document.createElement("img");
                const objectURL = URL.createObjectURL(h.picture);
                img.src = objectURL;
                img.onload = () => URL.revokeObjectURL(img.src); // free memory
                img.className = "habit-picture";
                pictureDiv.appendChild(img);
            } 
            else {
              const placeholder = document.createElement("span");
              placeholder.textContent = h.name.charAt(0).toUpperCase();
              pictureDiv.appendChild(placeholder);
            }
            habitCard.appendChild(pictureDiv);

            const hName = document.createElement("span");
            hName.className = "habit-name";
            hName.textContent = h.name;
            habitCard.appendChild(hName);

            daySection.appendChild(habitCard);
        });
        container.appendChild(daySection);
    }
}
