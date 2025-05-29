require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const eventRoutes = require('./routes/events');
const reservationRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth'); // dodaj auth rute

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Rute
app.use('/api/events', eventRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);  // registruj auth rute

// Serve static files (ako imaš)
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.send('Backend radi');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});
// Stolovi
const tableRoutes = require('./routes/table');
app.use('/api/tables', tableRoutes);
