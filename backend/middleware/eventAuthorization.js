const db = require('../config/db');

async function eventAuthorization(req, res, next) {
  const userVenue = req.user.venue_name;
  const eventId = req.params.id;

  if (!eventId) {
    return res.status(400).json({ error: 'ID događaja nije prosleđen' });
  }

  try {
    const [rows] = await db.query('SELECT venue_name FROM events WHERE id = ?', [eventId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Događaj nije pronađen' });
    }

    if (rows[0].venue_name !== userVenue) {
      return res.status(403).json({ error: 'Nemate dozvolu za izmene ovog događaja' });
    }

    next();
  } catch (error) {
    console.error('Greška u autorizaciji događaja:', error);
    res.status(500).json({ error: 'Greška pri proveri autorizacije' });
  }
}

module.exports = eventAuthorization;
