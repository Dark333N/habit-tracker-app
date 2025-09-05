import { setupIcons, setActiveIcon, renderHabits } from "./ui.js";
import { addHabit } from "./database.js";

// Initialize icons
setupIcons();

// Navigation handling
const buttons = document.querySelectorAll("button[data-screen]");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // get screen id
    const screenId = btn.dataset.screen;

    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");

    const activeTabBtn = document.querySelector(`.tab-bar button[data-screen="${screenId}"]`);
    if (activeTabBtn) {
      setActiveIcon(activeTabBtn);
    }

    // reset form
    const form = document.getElementById("add-habit-form");
    if (screenId !== "add-habit-screen") {
      if (form) form.reset();
    }
    else {
      if (form) {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("habit-date").value = today;
      }
    }
  });
});


// Get next 7 days

function getNext7Days() {
  const today = new Date();
  const next7Days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const iso = date.toISOString().split("T")[0];
    next7Days.push(iso);
  }
  return next7Days;
}

// form submit

document.getElementById("add-habit-form").addEventListener("submit", async e => {
  e.preventDefault();
  console.log("Form submitted");

  const habitName = document.getElementById("habit-name").value.trim();
  const habitDate = document.getElementById("habit-date").value;
  const habitType = document.getElementById("habit-type").value.trim();
  const habitMinutes = document.getElementById("habit-minutes").value || null;
  const habitInfo = document.getElementById("habit-info").value.trim() || "";
  const habitPicture = document.getElementById("habit-picture").files[0] || null;

  console.log(habitName, habitDate, habitType, habitMinutes, habitInfo, habitPicture);

  if (!habitName || !habitDate || !habitType) {
    alert("Please fill in all required fields.");
    return;
  }

  await addHabit(habitDate, habitName, habitType, habitMinutes, habitInfo, habitPicture);

  e.target.reset();

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById("home-screen").classList.add("active");

  renderHabits(getNext7Days());
});

renderHabits(getNext7Days());
