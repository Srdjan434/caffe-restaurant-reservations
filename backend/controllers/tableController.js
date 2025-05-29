const db = require('../config/db');

// Dohvati sve stolove za lokal
exports.getTablesByVenue = (req, res) => {
  const venueName = req.params.venue;

  db.query('SELECT * FROM tables WHERE venue_name = ?', [venueName], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', err });
    res.json(results);
  });
};

// Dohvati sve zauzete stolove za dati događaj
exports.getReservedTables = (req, res) => {
  const eventId = req.params.eventId;

  const query = `
    SELECT t.table_number 
    FROM event_tables et 
    JOIN tables t ON et.table_id = t.id 
    WHERE et.event_id = ?
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', err });
    const reserved = results.map(row => row.table_number);
    res.json(reserved);
  });
};
