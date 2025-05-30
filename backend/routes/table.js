const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Prvo specifičnije rute
router.get('/reserved/:eventId', tableController.getReservedTables);
router.get('/:venue_name', tableController.getTablesByVenue);

module.exports = router;
