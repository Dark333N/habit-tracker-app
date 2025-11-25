import { ICONS, MAIN_HABITS } from "./constants_v2.js";
import { getHabitsByDate } from "./database_v2.js";
import { getCurrentStage, filterTodoAndDoneHabits, attachSwipe } from "./app_v2.js";



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


/****************************************************
                    Render Main Habits
  ****************************************************/


// Helper function to get rendereing information of main habits
function getMainHabitInfo(habit_name) {
  const main_habit = MAIN_HABITS.find(habit => habit.name === habit_name);
  const main_habit_info = {
    emoji: main_habit.emoji,
    display_name: main_habit.display_name,
    habit_picture: main_habit.img_url,
    progression: main_habit.progression,
    special: main_habit.special
  };
  return main_habit_info;
}

// Helper function to fill the value in the display name

async function finishDisplayName(main_habit_info) {

  const template = main_habit_info.display_name;
  const stageIndex = await getCurrentStage();
  const stage = main_habit_info.progression?.[stageIndex];

  const target = stage.target;

  if (!stage) return template;

  if (main_habit_info.special) {
    if (main_habit_info.display_name === "Wake up at {{value}}") {
      const placeholder_target = `${Math.floor(target / 60)}:${target % 60}`;
      return template.replace("{{value}}", placeholder_target);
    }
    else if (main_habit_info.display_name === "Learn {{value}} hours") {
      if (target === 1) {
        const placeholder_template = template.replace("hours", "hour");
        return placeholder_template.replace("{{value}}", target);
      }
      else {
        return template.replace("{{value}}", target);
      }
    }
    else {
      const placeholder_target = `${Math.floor(target / 60)}h ${target % 60}min`;
      return template.replace("{{value}}", placeholder_target);
    }
  }
  else {
    if (template.includes("{{value}}")) {
      const result = template.replace("{{value}}", target);
      return result;
    }
    return template;
  }
}


// Function to render difficulty stars

function renderDifficulty(difficulty) {
  const container = document.createElement("div");
  container.className = "main-habit-difficulty";
  container.textContent = "Difficulty: ";

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("span");
    star.textContent = "✦ ";
    if (i < difficulty) {
      star.className = "white-star";
    }
    else {
      star.className = "gray-star";
    }
    container.appendChild(star);
  }

  return container;
}


// Rendering function for main habits

export async function renderMainHabits(mh) {

  const main_habits = mh

  const main_habits_container = document.querySelector(".main-habits-container.shown");
  main_habits_container.innerHTML = "";


  for (const main_habit of main_habits) {

    const main_habit_card = document.createElement("div");
    main_habit_card.classList.add("main-habit-card");

    // Habit content
    const additional_info = getMainHabitInfo(main_habit.name);


    const main_habit_content = document.createElement("div");
    main_habit_content.classList.add("main-habit-content", "compressed");

    const main_habit_emoji = document.createElement("div");
    main_habit_emoji.className = "main-habit-emoji";
    main_habit_emoji.textContent = additional_info.emoji;
    main_habit_content.appendChild(main_habit_emoji);

    const main_habit_title = document.createElement("div");
    main_habit_title.className = "main-habit-title";
    main_habit_title.textContent = await finishDisplayName(additional_info);
    main_habit_content.appendChild(main_habit_title);

    const main_habit_picture = document.createElement("img");
    main_habit_picture.src = additional_info.habit_picture;
    main_habit_picture.classList.add("main-habit-picture", "compressed");
    main_habit_content.appendChild(main_habit_picture);

    const additional_info_wrapper = document.createElement("div");
    additional_info_wrapper.className = "additional-info-wrapper";

    const main_habit_info = document.createElement("div");
    main_habit_info.className = "main-habit-info";
    main_habit_info.textContent = main_habit.info;
    additional_info_wrapper.appendChild(main_habit_info);

    const main_habit_difficulty = renderDifficulty(additional_info.progression[await getCurrentStage()].difficulty);
    additional_info_wrapper.appendChild(main_habit_difficulty);

    const main_habit_xp = document.createElement("div");
    main_habit_xp.className = "main-habit-xp";
    main_habit_xp.textContent = `XP: ${main_habit.xp}`;
    additional_info_wrapper.appendChild(main_habit_xp);

    main_habit_content.appendChild(additional_info_wrapper);


    main_habit_card.appendChild(main_habit_content);

    // Done check button

    const done_check_button = document.createElement("div");

    done_check_button.className = "done-check-button";
    done_check_button.textContent = "Done!";
    done_check_button.dataset.id = main_habit.id; 
    done_check_button.dataset.completed = main_habit.completed;

    const done_check_text = document.createElement("span");
    done_check_text.className = "done-check-text";
    done_check_text.textContent = "Complete habit and get XP!";

    if (main_habits_container.id === "main-done-habits") {
      done_check_button.classList.add("undo-button");
      done_check_button.textContent = "Undo!";

      done_check_text.classList.add("undo-text");
      done_check_text.textContent = "Move back to todo!";
    }

    done_check_button.appendChild(done_check_text);

    main_habit_card.appendChild(done_check_button);

    main_habits_container.appendChild(main_habit_card);
  }

  if (main_habits.length === 0) {
    if( main_habits_container.id === "main-todo-habits") {
      main_habits_container.textContent = "Congratulations, you have completed all your habits!";
    }
    else if (main_habits_container.id === "main-done-habits") {
      main_habits_container.textContent = "Start working and complete some habits!";
    }
    else if (main_habits_container.id === "main-skipped-habits") {
      main_habits_container.textContent = "Congratulations, you have no skipped habits today!";
    }
  }

  attachSwipe();
};


// Rendering current main habits container

export async function rerenderCurrentMainHabits() {
  const shown_container = document.querySelector(".main-habits-container.shown");
  if (shown_container.id === "main-todo-habits") {
    await renderMainHabits(await filterTodoAndDoneHabits("todo"));
  }
  else if (shown_container.id === "main-done-habits") {
    await renderMainHabits(await filterTodoAndDoneHabits("done"));
  }
  else if (shown_container.id === "main-skipped-habits") {
    await renderMainHabits(await filterTodoAndDoneHabits("skipped"));
  }
};
