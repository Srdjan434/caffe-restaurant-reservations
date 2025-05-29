const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'srdjanjokic13@gmail.com',
    pass: 'lshm zzsv ztke rmvc',
  },
});

async function sendReservationEmail(to, reservationData) {
  const mailOptions = {
    from: '"Rezervacije" <srdjanjokic13@gmail.com>',
    to,
    subject: `Nova rezervacija za ${reservationData.venue_name}`,
    html: `
      <h3>Nova rezervacija za događaj: ${reservationData.title}</h3>
      <p><strong>Ime i prezime:</strong> ${reservationData.full_name}</p>
      <p><strong>Email:</strong> ${reservationData.email}</p>
      <p><strong>Kontakt telefon:</strong> ${reservationData.phone_number}</p>
      <p><strong>Broj osoba:</strong> ${reservationData.number_of_people}</p>
      <p><strong>Datum događaja:</strong> ${new Date(reservationData.event_date).toLocaleDateString()}</p>
      <p><strong>Lokacija:</strong> ${reservationData.venue_name}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendReservationEmail };
