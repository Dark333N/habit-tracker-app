
export const db = new Dexie("HabitsDB");
db.version(1).stores({
    habits: "++id,date,name,type,minutes,completed,picture"
});

// helpers

export async function addHabit(date, name, type, minutes=null, picture=null) {
    await db.habits.add({ date, name, type, minutes, picture });
}

export async function getHabitsByDate(date) {
  return db.habits.where("date").equals(date).toArray();
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
