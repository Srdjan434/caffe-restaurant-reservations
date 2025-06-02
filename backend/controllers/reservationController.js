const db = require('../config/db');
const { sendReservationEmail } = require('../utils/emailService');

exports.createReservation = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    number_of_people,
    venue_name,
    event_date,
    event_id,
    title,
    table_id
  } = req.body;

  if (!full_name || !email || !phone_number || !number_of_people || !venue_name || !event_date || !event_id || !table_id) {
    return res.status(400).json({ error: 'Sva polja su obavezna, uključujući sto.' });
  }

try {
  const eventDateOnly = new Date(event_date).toISOString().split('T')[0];

  await db.query(
    `INSERT INTO reservations (full_name, email, phone_number, number_of_people, venue_name, event_date, event_id, table_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_number, number_of_people, venue_name, eventDateOnly, event_id, table_id]
  );

  // Dodaj sto kao zauzet za taj događaj
  await db.query(
    'INSERT INTO event_tables (event_id, table_id) VALUES (?, ?)',
    [event_id, table_id]
  );

  // Izvuci broj stola
  const [tableRows] = await db.query(
    'SELECT table_number FROM tables WHERE id = ?',
    [table_id]
  );

  const table_number = tableRows.length > 0 ? tableRows[0].table_number : 'Nepoznat';

  const managerEmail = 'srdjanjokic13@gmail.com';

  await sendReservationEmail(managerEmail, {
    full_name,
    email,
    phone_number,
    number_of_people,
    venue_name,
    event_date: eventDateOnly,
    title,
    table_id,
    table_number
  });

  res.status(201).json({ message: 'Rezervacija uspešno kreirana i poslata emailom' });
} catch (error) {
  console.error('Greška pri kreiranju rezervacije:', error);
  res.status(500).json({ error: 'Greška prilikom slanja rezervacije' });
}
};
// GET rezervacija za određeni sto i događaj
exports.getReservationByTableAndEvent = async (req, res) => {
  const { tableId, eventId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT full_name, email, phone_number, number_of_people
       FROM reservations
       WHERE table_id = ? AND event_id = ?
       LIMIT 1`,
      [tableId, eventId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rezervacija nije pronađena.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Greška u getReservationByTableAndEvent:', err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
};


