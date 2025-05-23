const db = require('../config/db');
const eventModel = require('../models/eventModel');

// GET svi događaji
exports.getEvents = async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT e.*, vi.image_path
      FROM events e
      LEFT JOIN venue_images vi ON e.venue_name = vi.venue_name
      ORDER BY e.event_date ASC
    `);
    res.json(events);
  } catch (error) {
    console.error('Greška pri dohvaćanju događaja:', error);
    res.status(500).json({ error: 'Greška pri dohvaćanju događaja' });
  }
};

// GET događaj po ID
exports.getEventById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, vi.image_path
      FROM events e
      LEFT JOIN venue_images vi ON e.venue_name = vi.venue_name
      WHERE e.id = ?`, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Događaj nije pronađen' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Greška pri dohvaćanju događaja:', error);
    res.status(500).json({ error: 'Greška pri dohvaćanju događaja' });
  }
};

// Kreiranje događaja (menadžer)
exports.createEvent = async (req, res) => {
  const { title, description, event_date } = req.body;
  const venue_name = req.user.venue_name;

  if (!title || !description || !event_date) {
    return res.status(400).json({ error: 'Sva polja su obavezna' });
  }

  try {
    await db.query(
      `INSERT INTO events (venue_name, title, description, event_date, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [venue_name, title, description, event_date, req.user.email]
    );

    res.status(201).json({ message: 'Događaj uspešno dodat' });
  } catch (error) {
    console.error('Greška pri dodavanju događaja:', error);
    res.status(500).json({ error: 'Greška pri dodavanju događaja' });
  }
};

// Izmena događaja (menadžer samo za svoj lokal)
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, event_date } = req.body;
  const venue_name = req.user.venue_name;

  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ? AND venue_name = ?', [id, reg.user.id]);
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Nemate pristup ovom događaju' });
    }

    await db.query(
      `UPDATE events SET title = ?, description = ?, event_date = ? WHERE id = ?`,
      [title, description, event_date, id]
    );

    res.json({ message: 'Događaj uspešno izmenjen' });
  } catch (error) {
    console.error('Greška pri izmeni događaja:', error);
    res.status(500).json({ error: 'Greška pri izmeni događaja' });
  }
};

// Brisanje događaja (menadžer samo za svoj lokal)
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  const venue_name = req.user.venue_name;

  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ? AND venue_name = ?', [id, reg.user.id]);
    if (rows.length === 0) {
      return res.status(403).json({ error: 'Nemate pristup ovom događaju' });
    }

    await db.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ message: 'Događaj uspešno obrisan' });
  } catch (error) {
    console.error('Greška pri brisanju događaja:', error);
    res.status(500).json({ error: 'Greška pri brisanju događaja' });
  }
};

// Dohvati događaje koje je kreirao trenutni korisnik
exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await eventModel.getEventsByUserId(userId);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška pri učitavanju događaja' });
  }
};
