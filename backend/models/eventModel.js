const db = require('../config/db');

async function getAllEvents() {
  const [rows] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
  return rows;
}

// Dodaj ovu funkciju
async function getEventsByUserId(userId) {
  const [rows] = await db.query(
    `SELECT * FROM events WHERE created_by = ? ORDER BY event_date ASC`,
    [userId]
  );
  return rows;
}


module.exports = {
  getAllEvents,
  getEventsByUserId
};

