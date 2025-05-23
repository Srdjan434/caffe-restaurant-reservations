document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  console.log('Token iz localStorage:', token);

  const eventsList = document.getElementById('eventsList');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/events/mine', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const events = await res.json();

    if (!res.ok) {
      eventsList.innerHTML = '<p>Greška prilikom učitavanja događaja.</p>';
      return;
    }

    if (events.length === 0) {
      eventsList.innerHTML = '<p>Nema događaja.</p>';
      return;
    }

    eventsList.innerHTML = '';

    events.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('event-card');

      eventDiv.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Datum:</strong> ${new Date(event.event_date).toLocaleDateString('sr-RS')}</p>
        <button onclick="editEvent(${event.id})">Izmeni</button>
        <button onclick="deleteEvent(${event.id})">Obriši</button>
      `;

      eventsList.appendChild(eventDiv);
    });

  } catch (err) {
    console.error(err);
    eventsList.innerHTML = '<p>Došlo je do greške na serveru.</p>';
  }
});

document.getElementById('addEventBtn').addEventListener('click', () => {
  window.location.href = 'eventForm.html';
});

function editEvent(id) {
  window.location.href = `eventForm.html?id=${id}`;
}

async function deleteEvent(id) {
  const confirmed = confirm('Da li sigurno želite da obrišete događaj?');

  if (!confirmed) return;

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`http://localhost:3000/api/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      location.reload();
    } else {
      alert('Greška pri brisanju događaja.');
    }
  } catch (err) {
    console.error(err);
    alert('Greška pri komunikaciji sa serverom.');
  }
}
