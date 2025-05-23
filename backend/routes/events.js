const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const eventAuthorization = require('../middleware/eventAuthorization');

// Javne rute
router.get('/mine', authMiddleware, eventController.getMyEvents);  // mora pre /:id
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);


// Zaštićene rute
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventAuthorization, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventAuthorization, eventController.deleteEvent);

module.exports = router;
