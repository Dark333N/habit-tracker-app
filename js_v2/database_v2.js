
export const db = new Dexie("HabitsDB");
db.version(1).stores({
    habits: "++id,date,name,types,completed,info,xp,main",
    settings: "key"
});

// helpers


export async function setStreakStart(date) {
  return db.settings.put({ key: "streakStart", value: date });
}

export async function getStreakStart() {
  return db.settings.get("streakStart");
}

export async function addHabit(date, name, types, completed=false, info="", xp=0, main=false) {
    await db.habits.add({ date, name, types, completed, info, xp, main});
}

export async function getHabitsByDate(date) {
  const habits = await db.habits.where("date").equals(date).toArray();
  return habits;
}

export async function getHabitsForDays(days) {
  const result = {};
  for (const key of days) {
    result[key] = await getHabitsByDate(key);
  }
  return result;
}

export async function deleteHabit(id) {
  return db.habits.delete(id);
}

// Set completed status
export async function setHabitCompleted(id, completed) {
  return db.habits.update(id, { completed });
}

// Get overdue habits
export async function getOverdueHabits() {
  const today = new Date().toISOString().split('T')[0];
  return db.habits
    .where("date")
    .below(today)
    .and(habit => !habit.completed)
    .toArray();
}

// Get done habits
export async function getDoneHabits() {
  const today = new Date().toISOString().split('T')[0];
  return db.habits
    .where("date")
    .below(today)
    .and(habit => habit.completed)
    .toArray();
}

export async function getHabitById(id) {
  return db.habits.get(id);
}

export async function updateHabit(id, data) {
  return db.habits.update(id, data);
}
