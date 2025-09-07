import { setupIcons, setActiveIcon, renderHabits } from "./ui.js";
import { addHabit, setHabitCompleted } from "./database.js";

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

// Resize/compress images and store as base64

async function resizeAndCompress(file, maxSize=300, quality=0.9) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to Base64
      const base64 = canvas.toDataURL("image/jpeg", quality);
      resolve(base64);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
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


  let habitPicture = null;
  const fileInput = document.getElementById("habit-picture").files[0] || null;

  if (fileInput) {
    habitPicture = await resizeAndCompress(fileInput, 300, 0.9);
  }


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


// Set habit completed on click of check button
document.getElementById("habits-container").addEventListener("click", async e => {
  if (e.target.classList.contains("habit-check-btn")) {
    const id = Number(e.target.dataset.id);
    const completed = e.target.dataset.completed === "true";

    await setHabitCompleted(id, !completed);
    renderHabits(getNext7Days());
  }
});
