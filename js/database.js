
export const db = new Dexie("HabitsDB");
db.version(1).stores({
    habits: "++id,date,name,type,minutes,completed"
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
