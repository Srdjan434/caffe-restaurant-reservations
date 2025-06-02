const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/', reservationController.createReservation);

router.get('/table/:tableId/event/:eventId', reservationController.getReservationByTableAndEvent);

module.exports = router;
