const db = require('../config/db');

// Dohvati sve stolove za lokal
exports.getTablesByVenue = async (req, res) => {
  const venueName = req.params.venue_name;
  //console.log('Zahtev za stolove za lokal:', venueName);

  try {
    const [results] = await db.query('SELECT * FROM tables WHERE venue_name = ?', [venueName]);
    //console.log('Rezultati:', results);
    res.json(results);
  } catch (err) {
    console.error('Greška u bazi:', err);
    res.status(500).json({ error: 'Database error', err });
  }
};

// Dohvati sve zauzete stolove za dati događaj
exports.getReservedTables = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const [results] = await db.query(`
      SELECT t.table_number, t.id 
      FROM event_tables et 
      JOIN tables t ON et.table_id = t.id 
      WHERE et.event_id = ?
    `, [eventId]);

    res.json(results);
  } catch (err) {
    console.error('Greška u bazi:', err);
    res.status(500).json({ error: 'Database error', err });
  }
};
