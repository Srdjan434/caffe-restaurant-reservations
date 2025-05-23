const JWT_SECRET = process.env.JWT_SECRET || 'tajni_kljuc';

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Niste autorizovani' });
  }

  const token = authHeader.split(' ')[1];

  try {
const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded treba da sadrži email i venue_name
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Neispravan token' });
  }
};

module.exports = authMiddleware;
