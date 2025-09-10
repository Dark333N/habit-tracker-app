
export const db = new Dexie("HabitsDB");
db.version(1).stores({
    habits: "++id,date,name,type,minutes,completed,info,picture"
});

// helpers

export async function addHabit(date, name, type, minutes=null, completed=false, info="", picture=null) {
    await db.habits.add({ date, name, type, minutes, completed, info, picture});
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
