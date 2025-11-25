import { createProgression } from "./app_v2.js"


export const ICONS = {
    home: ["M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z", 
        "m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"],
    calendar: ["M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"],
    chart: ["M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z"],
    profile: ["M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"]
}


// Store main habits

export const MAIN_HABITS = [
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 430,
      targetIncrement: -20,
      startXp: 11,
      xpIncrement: 6,
    }),
    name: "Wake up",
    display_name: "Wake up at {{value}}",
    types: ["discipline", "productivity"],
    info: "Size the day and get ahead of everybody.",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr"],
    img_url: "assets/images/main_habit1.png",
    emoji: "🌇",
    special: true
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 10,
      targetIncrement: 1,
      startXp: 8,
      xpIncrement: 4,
    }),
    name: "Meditation",
    display_name: "Meditate for {{value}} minutes",
    types: ["focus", "confidence"],
    info: "Clear your mind and increase your focus.",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    img_url: "assets/images/main_habit2.png",
    emoji: "🧘",
    special: false
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 10,
      targetIncrement: 2,
      startXp: 9,
      xpIncrement: 4,
    }),
    name: "Read",
    display_name: "Read for {{value}} minutes",
    types: ["wisdom", "discipline"],
    info: "Books are food for the brain.",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    img_url: "assets/images/main_habit3.png",
    emoji: "📖",
    special: false
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 1,
      targetIncrement: 0.25,
      startXp: 7,
      xpIncrement: 8,
    }),
    name: "Learn",
    display_name: "Learn {{value}} hours",
    types: ["wisdom", "discipline"],
    info: "Learn a new skill.",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr"],
    img_url: "assets/images/main_habit4.png",
    emoji: "📚",
    special: true
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 0,
      targetIncrement: 0,
      startXp: 35,
      xpIncrement: 0,
    }),
    name: "Jogging",
    display_name: "Go for a run",
    types: ["strength", "discipline"],
    info: "Train your endurance and your mind.",
    weekdays: ["Mo", "Tu", "Fr", "Sa"],
    img_url: "assets/images/main_habit5.png",
    emoji: "🏃",
    special: false
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 0,
      targetIncrement: 0,
      startXp: 20,
      xpIncrement: 0,
    }),
    name: "Trading",
    display_name: "Trading",
    types: ["wisdom", "discipline"],
    info: "Try to beat the market.",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr"],
    img_url: "assets/images/main_habit6.png",
    emoji: "📈",
    special: false
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 0,
      targetIncrement: 0,
      startXp: 35,
      xpIncrement: 0,
    }),
    name: "Workout",
    display_name: "Do a workout",
    types: ["strength", "confidence"],
    info: "Strain your body, rest your mind.",
    weekdays: ["Mo", "Tu", "Th", "Fr"],
    img_url: "assets/images/main_habit7.png",
    emoji: "🏋️‍♂️",
    special: false
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 160,
      targetIncrement: -10,
      startXp: 7,
      xpIncrement: 6,
    }),
    name: "Screen time",
    display_name: "Limit screen time to {{value}} minutes",
    types: ["productivity", "focus"],
    info: "Don't waste your time on distractions.",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Su"],
    img_url: "assets/images/main_habit8.png",
    emoji: "📱",
    special: true
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 0,
      targetIncrement: 0,
      startXp: 25,
      xpIncrement: 0,
    }),
    name: "Cold shower",
    display_name: "Take a cold shower",
    types: ["confidence", "focus"],
    info: "Go out of the comfort zone.",
    weekdays: ["Mo", "We", "Fr", "Sa"],
    img_url: "assets/images/main_habit9.png",
    emoji: "❄️",
    special: false
  },
  {
    progression: createProgression({
      totalDays: 90,
      interval: 7,
      startTarget: 0,
      targetIncrement: 0,
      startXp: 20,
      xpIncrement: 0,
    }),
    name: "Journal",
    display_name: "Write your journal",
    types: ["confidence", "focus"],
    info: "Reflect on your day and visualize your goals.",
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Su"],
    img_url: "assets/images/main_habit10.png",
    emoji: "✏️",
    special: false
  }
]
