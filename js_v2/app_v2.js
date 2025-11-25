import { setupIcons, setActiveIcon, renderMainHabits, rerenderCurrentMainHabits} from "./ui_v2.js";
import { setStreakStart, getStreakStart, getHabitsByDate, addHabit, setHabitCompleted} from "./database_v2.js";
import { MAIN_HABITS } from "./constants_v2.js";



/********************************************
     Global Variables and Initial Setup
 ********************************************/

let editHabitId = null; // Track the habit being edited

const existing = await getStreakStart();
if (!existing) {
  await setStreakStart(new Date().toISOString());
}

// Function to get streak day
async function getStreakDay() {
  //Calculate difference between today and streak start
  const today = new Date().toISOString().split("T")[0];
  const startObj = await getStreakStart();
  const start = startObj.value.split("T")[0];
  const diff = Math.floor((Date.parse(today) - Date.parse(start)) / (1000 * 60 * 60 * 24));
  return diff;
}

// Function to get current day
function getCurrentDayShort() {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  return days[today];
}

export async function getCurrentStage() {
  const streakDay = await getStreakDay();
  const stage = Math.floor((streakDay / 7) / 2);
  return stage;
}



// Ensuring order
(async function init() {
  mainHabitsCheck();
  await renderMainHabits(await filterTodoAndDoneHabits("todo"));
  attachSwipe();
  updateHabitCounter();

  document.querySelectorAll(".main-habit-btns").forEach(b => {
    b.classList.remove("white");
  })
  document.getElementById("todo-btn").classList.add("white");
})();

attachExpandCollapse(document.getElementById("main-todo-habits"));
attachExpandCollapse(document.getElementById("main-done-habits"));
attachExpandCollapse(document.getElementById("main-skipped-habits"));

/****************************************************
                    Handling Main Habits
  ****************************************************/


//      ------  Function to create Progression  ------
export function createProgression({totalDays, interval=7, startTarget, targetIncrement, startXp, xpIncrement}) {
  const progression = [];
  const stages = Math.ceil((totalDays / interval) / 2);
  for (let i = 0; i < stages; i++) {
    const stage = {};
    stage.target = startTarget + i * targetIncrement;
    stage.xp = startXp + i * xpIncrement;
    stage.difficulty = Math.floor(stage.xp / 10);
    progression.push(stage);
  }
  return progression;

}


//      ------  Function to filter out habits for today  ------

function filterHabits(habits) {
  const today = getCurrentDayShort();
  return habits.filter(habit => habit.weekdays.includes(today));
}


//      ------  function to see if main habits were already added to today  ------
async function mainHabitsCheck() {
  const today = new Date().toISOString().split("T")[0];
  const habits = await getHabitsByDate(today);
  
  let main_flag = false;

  for (const habit of habits) {
    if (habit.main) {
      main_flag = true;
      break;
    }
  }

  if (!main_flag) {
    const mainHabits = filterHabits(MAIN_HABITS);

    const stage = await getCurrentStage();

    for (const m_habit of mainHabits) {
      await addHabit(today, m_habit.name, m_habit.types, false, m_habit.info, m_habit.progression[stage].xp, m_habit.img_url, true);
    }
  }
}


//      ------  Eventlistener for every card in order to expand or compress it  ------
function attachExpandCollapse(container) {
  container.addEventListener("click", (e) => {
    const card = e.target.closest(".main-habit-content");
    if (!card) return;

    const isExpanded = card.classList.contains("expanded");

    // Collapse all cards in this container
    container.querySelectorAll(".main-habit-content").forEach(c => {
      c.classList.remove("expanded");
      c.classList.add("compressed");
      c.style.transform = "translateX(0)";
      const picture = c.querySelector(".main-habit-picture");
      if (picture) {
        picture.classList.remove("expanded");
        picture.classList.add("compressed");
      }
    });

    // Expand clicked card if it wasn’t already expanded
    if (!isExpanded) {
      card.classList.remove("compressed");
      card.classList.add("expanded");
      const picture = card.querySelector(".main-habit-picture");
      if (picture) {
        picture.classList.remove("compressed");
        picture.classList.add("expanded");
      }
    }
  });
}






//      ------   Swipe function   ------
export function attachSwipe() {
  document.querySelectorAll(".main-habit-card").forEach(card => {
    const content = card.querySelector(".main-habit-content");
    if (!content) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // prevent text selection during drag (desktop)
    const startDrag = (x) => {
      startX = x;
      isDragging = true;
      content.style.transition = "none"; // disable during drag
      document.body.style.userSelect = "none";
    };

    const moveDrag = (x) => {
      if (!isDragging) return;
      currentX = x - startX;
      if (currentX > 0) {
        content.style.transform = `translateX(${currentX}px)`;
      } else {
        content.style.transform = `translateX(0)`;
      }
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      document.body.style.userSelect = "";
      // snap with transition
      content.style.transition = "transform 0.2s ease";
      if (currentX > 90) {
        content.style.transform = `translateX(110px)`; // reveal button
      } else {
        content.style.transform = `translateX(0)`;
      }
      currentX = 0;
    };

    // --- Touch events ---
    card.addEventListener("touchstart", (e) => {
    if (e.target.closest(".done-check-button")) return;
      startDrag(e.touches[0].clientX), { passive: true }
    });
    card.addEventListener("touchmove", (e) => moveDrag(e.touches[0].clientX), { passive: true });
    card.addEventListener("touchend", endDrag);

    // --- Mouse events ---
    card.addEventListener("mousedown", (e) => {
      if (e.target.closest(".done-check-button")) return;
      startDrag(e.clientX)
    });
    // track movement on document so dragging outside still works
    document.addEventListener("mousemove", (e) => moveDrag(e.clientX));
    document.addEventListener("mouseup", endDrag);

    // optional: reset if you leave the window
    window.addEventListener("blur", endDrag);
  });
}



//      ------  Done check buttons eventlistener  ------

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".done-check-button");
  if (!btn) return;

  const habitId = btn.dataset.id;
  const completed = btn.dataset.completed === "true";

  // Call your DB update function
  await setHabitCompleted(Number(habitId), !completed);
  btn.dataset.completed = !btn.dataset.completed;

  // Update the UI
  await rerenderCurrentMainHabits()
  await updateHabitCounter();
});


//      ------  Todo, Done, Skipped button eventlistener  ------   

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".main-habit-btns");
  if (!btn) return;

  const btn_id = btn.id

  document.querySelectorAll(".main-habit-btns").forEach(b => {
    b.classList.remove("white");
  })

  btn.classList.add("white");

  document.querySelectorAll(".main-habits-container").forEach(c => {
      c.classList.remove("shown");
  })



  if (btn_id === "todo-btn") {
    document.getElementById("main-todo-habits").classList.add("shown");
    rerenderCurrentMainHabits();
  }
  else if (btn_id === "done-btn") {
    document.getElementById("main-done-habits").classList.add("shown");
    rerenderCurrentMainHabits();
  }
  else if (btn_id === "skipped-btn") {
    document.getElementById("main-skipped-habits").classList.add("shown");
    rerenderCurrentMainHabits();
  }

  
});



//      ------  Function to update HabitCounter  ------   

async function updateHabitCounter() {
  const todo_habits = await getHabitsByDate(new Date().toISOString().split("T")[0]);
  const todo_habits_count = todo_habits.filter(habit => !habit.completed).length;
  const done_habits = await getHabitsByDate(new Date().toISOString().split("T")[0]);
  const done_habits_count = done_habits.filter(habit => habit.completed).length;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterday_string = yesterday.toISOString().split("T")[0];

  const skipped_habits = await getHabitsByDate(yesterday_string);
  const skipped_habits_count = skipped_habits.filter(habit => !habit.completed).length;

  document.getElementById("todo-count").textContent = Number(todo_habits_count) || 0;
  document.getElementById("done-count").textContent = Number(done_habits_count) || 0;
  document.getElementById("skipped-count").textContent = Number(skipped_habits_count) || 0;
}



//      -----  Function to get habits for rendering  ------

export async function filterTodoAndDoneHabits(type){
  if (type === "todo") {
    const todays_habits = await getHabitsByDate(new Date().toISOString().split("T")[0]);
    const todays_main_habits = todays_habits.filter(habit => habit.main);
    return todays_main_habits.filter(habit => !habit.completed);
  } else if (type === "done") {
    const todays_habits = await getHabitsByDate(new Date().toISOString().split("T")[0]);
    const todays_main_habits = todays_habits.filter(habit => habit.main);
    return todays_main_habits.filter(habit => habit.completed);
  }
  else if (type === "skipped") {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterday_string = yesterday.toISOString().split("T")[0];

    const todays_habits = await getHabitsByDate(yesterday_string);
    const todays_main_habits = todays_habits.filter(habit => habit.main);
    return todays_main_habits.filter(habit => !habit.completed);
  }
};


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

    // Set active icon
    const activeTabBtn = document.querySelector(`.tab-bar button[data-screen="${screenId}"]`);
    if (activeTabBtn) {
      setActiveIcon(activeTabBtn);
    }

  });
});
