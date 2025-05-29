const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Prvo statične rute, onda dinamične!
router.get('/reserved/:eventId', tableController.getReservedTables); // /api/tables/reserved/3
router.get('/:venue', tableController.getTablesByVenue);             // /api/tables/NazivLokala

module.exports = router;
