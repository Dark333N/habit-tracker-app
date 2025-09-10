import { ICONS } from "./constants.js";
import { getHabitsForDays, getOverdueHabits, getDoneHabits, getHabitById } from "./database.js";



/*****************************************************
                Navigation and Icons
  ****************************************************/

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


/*****************************************************
                Render Habits for Next 7 Days
  ****************************************************/

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

            if (typeof h.picture === "string"){
              const img = document.createElement("img");
              img.src = h.picture;
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
            hName.dataset.id = h.id;
            hName.textContent = h.name;
            habitCard.appendChild(hName);

            const checkBtn = document.createElement("button");
            checkBtn.className = "habit-check-btn";
            checkBtn.dataset.id = h.id;
            checkBtn.dataset.completed = h.completed;
            checkBtn.innerHTML = h.completed ? "&#10003;" : ""; // checkmark
            if (h.completed) {
              checkBtn.classList.add("habit-completed");
            }

            habitCard.appendChild(checkBtn);

            daySection.appendChild(habitCard);
        });
        container.appendChild(daySection);
    }
}


/*****************************************************
            Render Overdue and Done Habits
  ****************************************************/

export async function renderOverdueAndDone(boolean) {

  let smallHabitsContainer;
  if (boolean) smallHabitsContainer = document.getElementById("done-habits-container");
  else smallHabitsContainer = document.getElementById("overdue-habits-container");

  smallHabitsContainer.innerHTML = "";

  let habitsToRender;

  if (boolean) {
    habitsToRender = await getDoneHabits();
    if (habitsToRender.length === 0) {
      smallHabitsContainer.textContent = "No done habits this month!";
      return;
    }
  } else {
    habitsToRender = await getOverdueHabits();
    if (habitsToRender.length === 0) {
      smallHabitsContainer.textContent = "No overdue habits!";
      return;
    }
  }
  

  // Group by date
  const grouped = {};
  habitsToRender.forEach(h => {
    if (!grouped[h.date]) {
      grouped[h.date] = [];
    }
    grouped[h.date].push(h);
  });

  for (const date in grouped) {
    const dateSection = document.createElement("div");
    dateSection.className = "day-section";

    const title = document.createElement("div");
    title.className = "day-title";
    title.textContent = date;
    dateSection.appendChild(title);

    grouped[date].forEach(h => {
      const habitCard = document.createElement("div");
      habitCard.className = "habit-card-small";

      const hName = document.createElement("span");
      hName.className = "habit-name";
      hName.dataset.id = h.id;
      hName.textContent = h.name;
      habitCard.appendChild(hName);

      const checkBtn = document.createElement("button");
      checkBtn.className = "habit-check-btn";
      checkBtn.dataset.id = h.id;
      checkBtn.dataset.completed = h.completed;
      checkBtn.innerHTML = h.completed ? "&#10003;" : ""; // checkmark
      if (h.completed) {
        checkBtn.classList.add("habit-completed");
      }

      habitCard.appendChild(checkBtn);

      dateSection.appendChild(habitCard);
    });
    smallHabitsContainer.appendChild(dateSection);
  }
}


/*****************************************************
                     Habit Modal
  ****************************************************/

const modal = document.getElementById("habit-modal");

export async function openHabitModal(habitId) {
  const habit = await getHabitById(habitId);

  document.getElementById("modal-habit-name").textContent = habit.name;
  document.getElementById("modal-habit-date").textContent = habit.date;
  document.getElementById("modal-habit-type").textContent = habit.type;
  document.getElementById("modal-habit-minutes").textContent = habit.minutes ? `${habit.minutes} minutes` : "No time set";
  document.getElementById("modal-habit-info").textContent = habit.info || "No additional info";


  document.getElementById("delete-habit-btn").dataset.id = habit.id;
  modal.classList.remove("hidden");
}

export function closeHabitModal() {
  modal.classList.add("hidden");
}
