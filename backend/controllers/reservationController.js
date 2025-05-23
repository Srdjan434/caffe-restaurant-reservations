const db = require('../config/db');
const { sendReservationEmail } = require('../utils/emailService');
const { sendTelegramMessage } = require('../utils/telegramService'); // dodaj ovo

exports.createReservation = async (req, res) => {
  const { full_name, email, number_of_people, venue_name, event_date, event_id, title } = req.body;

  if (!full_name || !email || !number_of_people || !venue_name || !event_date || !event_id) {
    return res.status(400).json({ error: 'Sva polja su obavezna' });
  }

  try {
    const eventDateOnly = new Date(event_date).toISOString().split('T')[0]; // format YYYY-MM-DD

    // Ubaci rezervaciju u bazu
    await db.query(
      `INSERT INTO reservations (full_name, email, number_of_people, venue_name, event_date, event_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [full_name, email, number_of_people, venue_name, eventDateOnly, event_id]
    );

    // Pošalji email na tvoj email
    const managerEmail = 'srdjanjokic13@gmail.com';
    await sendReservationEmail(managerEmail, { full_name, email, number_of_people, venue_name, event_date: eventDateOnly, title });

    // Dohvati telegram_chat_id menadžera iz baze za dati venue_name
    const [rows] = await db.query(`SELECT telegram_chat_id FROM users WHERE venue_name = ? LIMIT 1`, [venue_name]);

    if (rows.length > 0 && rows[0].telegram_chat_id) {
      const chatId = rows[0].telegram_chat_id;
      const message = `Nova rezervacija za ${venue_name}:\nIme: ${full_name}\nEmail: ${email}\nBroj osoba: ${number_of_people}\nDatum: ${eventDateOnly}\nDogađaj: ${title}`;

      // Pošalji Telegram poruku
      await sendTelegramMessage(chatId, message);
    }

    res.status(201).json({ message: 'Rezervacija uspešno kreirana i poslata emailom i na Telegram' });
  } catch (error) {
    console.error('Greška pri kreiranju rezervacije:', error);
    res.status(500).json({ error: 'Greška prilikom slanja rezervacije' });
  }
};
