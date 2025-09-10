import { setupIcons, setActiveIcon, renderHabits, renderOverdueAndDone, closeHabitModal, openHabitModal} from "./ui.js";
import { addHabit, deleteHabit, setHabitCompleted, getOverdueHabits, getDoneHabits} from "./database.js";



/****************************************************
                    Navigation and Icons
  ****************************************************/
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

    // Render done and overdue habits when switching to those screens
    if (screenId === "overdue-screen") {
      renderOverdueAndDone(false);
    }

    if (screenId === "done-screen") {
      renderOverdueAndDone(true);
    }

    // Set active icon
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


/*****************************************************
                    Form Handling
  ****************************************************/

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

  await addHabit(habitDate, habitName, habitType, habitMinutes, false, habitInfo, habitPicture);

  e.target.reset();

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  document.getElementById("home-screen").classList.add("active");

  renderHabits(getNext7Days());
});


/*****************************************************
                    Rendering Helpers
  ****************************************************/

renderHabits(getNext7Days());
updateCounters();



// Rerender current screen
export function rerenderCurrentScreen(){
  const activeScreen = document.querySelector(".screen.active");
  if (activeScreen.id === "home-screen") {
    renderHabits(getNext7Days());
  }
  else if (activeScreen.id === "overdue-screen") {
    renderOverdueAndDone(false);
  }
  else if (activeScreen.id === "done-screen") {
    renderOverdueAndDone(true);
  }

  // Update overdue and done counts
  updateCounters();
}

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


// Update counters for overdue and done habits
async function updateCounters() {
  const overdueH = await getOverdueHabits();
  const doneH = await getDoneHabits();

  document.getElementById("overdue-count").textContent = overdueH.length;
  document.getElementById("done-count").textContent = doneH.length;
}


/*****************************************************
                    Button Handling
  ****************************************************/

// Setup check button handling

function setupCheckButtonHandler(containerId) {
  const container = document.getElementById(containerId);
  container.addEventListener("click", async e => {
    if (e.target.classList.contains("habit-check-btn")) {
      const id = Number(e.target.dataset.id);
      const completed = e.target.dataset.completed === "true";
      await setHabitCompleted(id, !completed);
      rerenderCurrentScreen();
    }
  })
}

setupCheckButtonHandler("habits-container");
setupCheckButtonHandler("overdue-habits-container");
setupCheckButtonHandler("done-habits-container");


// Setup delete button handling

const deletBtn = document.getElementById("delete-habit-btn");
deletBtn.addEventListener("click", async () => {
  const id = Number(deletBtn.dataset.id);
  await deleteHabit(id);
  closeHabitModal();
  rerenderCurrentScreen();
});

const closeBtn = document.getElementById("modal-close-btn");
closeBtn.addEventListener("click", () => {
  closeHabitModal();
});

// Open habit modal

document.body.addEventListener("click", e => {
  if (e.target.classList.contains("habit-name")) {
    const id = Number(e.target.dataset.id);
    openHabitModal(id);
  }
});
