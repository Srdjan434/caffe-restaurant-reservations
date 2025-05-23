const bcrypt = require('bcrypt');

const plainPassword = 'publikatest123'; // <- promeni ovo svaki put kad ti treba nova lozinka

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error('Greška pri heširanju:', err);
  } else {
    console.log('Hashovana lozinka:', hash);
  }
});
