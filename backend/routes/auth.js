const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Opcionalno, možeš da ukloniš ako ne želiš javnu registraciju
router.post('/login', authController.login);

module.exports = router;
