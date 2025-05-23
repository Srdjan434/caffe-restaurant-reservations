const db = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function createUser(email, password, venue_name) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Korisnik sa ovim emailom već postoji');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const [result] = await db.query(
    `INSERT INTO users (email, password, venue_name) VALUES (?, ?, ?)`,
    [email, hashedPassword, venue_name]
  );
  return result;
}

async function findUserByEmail(email) {
  const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
}

async function verifyUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}

module.exports = { createUser, findUserByEmail, verifyUser };
