document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('events-container');

  try {
    const res = await fetch('http://localhost:3000/api/events');
    const events = await res.json();

    events.forEach(event => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <img src="http://localhost:3000/${event.image_path}" alt="${event.title}">
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p class="event-date"><strong>Datum:</strong> ${new Date(event.event_date).toLocaleDateString('sr-RS')}</p>
        <button onclick="window.open('event.html?id=${event.id}', '_blank')">Rezerviši</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<p>Greška pri učitavanju događaja.</p>';
    console.error(err);
  }
});
