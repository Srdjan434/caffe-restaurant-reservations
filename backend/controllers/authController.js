const jwt = require('jsonwebtoken');
const { createUser, verifyUser } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'tajni_kljuc';

exports.register = async (req, res) => {
  const { email, password, venue_name } = req.body;
  if (!email || !password || !venue_name) {
    return res.status(400).json({ error: 'Sva polja su obavezna' });
  }

  try {
    await createUser(email, password, venue_name);
    res.status(201).json({ message: 'Korisnik uspešno registrovan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška pri registraciji' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email i lozinka su obavezni' });
  }

  try {
    const user = await verifyUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, venue_name: user.venue_name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, venue_name: user.venue_name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška pri logovanju' });
  }
};
