const db = require('../config/db');
const { sendReservationEmail } = require('../utils/emailService');

exports.createReservation = async (req, res) => {
  const { full_name, email, phone_number, number_of_people, venue_name, event_date, event_id, title } = req.body;

  if (!full_name || !email || !phone_number || !number_of_people || !venue_name || !event_date || !event_id) {
    return res.status(400).json({ error: 'Sva polja su obavezna' });
  }

  try {
    const eventDateOnly = new Date(event_date).toISOString().split('T')[0];

    await db.query(
      `INSERT INTO reservations (full_name, email, phone_number, number_of_people, venue_name, event_date, event_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone_number, number_of_people, venue_name, eventDateOnly, event_id]
    );

    const managerEmail = 'srdjanjokic13@gmail.com';
    await sendReservationEmail(managerEmail, {
      full_name,
      email,
      phone_number,
      number_of_people,
      venue_name,
      event_date: eventDateOnly,
      title
    });

    res.status(201).json({ message: 'Rezervacija uspešno kreirana i poslata emailom' });
  } catch (error) {
    console.error('Greška pri kreiranju rezervacije:', error);
    res.status(500).json({ error: 'Greška prilikom slanja rezervacije' });
  }
};
