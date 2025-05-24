document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const form = document.getElementById('eventForm');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const dateInput = document.getElementById('event_date');
  const cancelBtn = document.getElementById('cancelBtn');
  const formTitle = document.getElementById('formTitle');

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // Ako editujemo događaj, popuni formu
  if (eventId) {
    formTitle.textContent = 'Izmeni događaj';
    try {
      const res = await fetch(`http://localhost:3000/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const event = await res.json();
        titleInput.value = event.title;
        descriptionInput.value = event.description;
        dateInput.value = event.event_date.split('T')[0]; // format: YYYY-MM-DD
      } else {
        const error = await res.json();
        alert(`Greška: ${error.error}`);
        window.location.href = 'dashboard.html';
      }
    } catch (err) {
      console.error('Greška pri dohvatanju događaja:', err);
      alert('Došlo je do greške.');
    }
  }

  // Submit forme za dodavanje/izmenu
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eventData = {
      title: titleInput.value,
      description: descriptionInput.value,
      event_date: dateInput.value
    };

    const url = eventId
      ? `http://localhost:3000/api/events/${eventId}`
      : 'http://localhost:3000/api/events';

    const method = eventId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (res.ok) {
        alert('Događaj je uspešno sačuvan!');
        window.location.href = 'dashboard.html';
      } else {
        const error = await res.json();
        alert(`Greška: ${error.error}`);
      }
    } catch (err) {
      console.error('Greška pri slanju podataka:', err);
      alert('Došlo je do greške.');
    }
  });

  // Otkaži dugme
  cancelBtn.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
});
