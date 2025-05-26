document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('events-container');

  try {
    const res = await fetch('http://localhost:3000/api/events');
    const events = await res.json();

    events.forEach(event => {
      const card = document.createElement('div');
      card.className = 'event-card';

      const img = document.createElement('img');
      img.src = `http://localhost:3000/${event.image_path}`;
      img.alt = event.title;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'event-content';

      const title = document.createElement('h3');
      title.className = 'event-title';
      title.textContent = event.title;

      const description = document.createElement('p');
      description.className = 'event-description';
      description.textContent = event.description;

      const date = document.createElement('p');
      date.className = 'event-date';
      date.innerHTML = `<strong>Datum:</strong> ${new Date(event.event_date).toLocaleDateString('sr-RS')}`;

      const rezervisiBtn = document.createElement('button');
      rezervisiBtn.className = 'rezervisi-btn';
      rezervisiBtn.textContent = 'Rezerviši';

      // ✅ Rešenje: ispravno otvori novi tab bez menjanja trenutnog taba
      rezervisiBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // ← sprečava neželjene događaje
        window.open(`event.html?id=${event.id}`, '_blank');
      });

      contentDiv.appendChild(title);
      contentDiv.appendChild(description);
      contentDiv.appendChild(date);
      contentDiv.appendChild(rezervisiBtn);

      card.appendChild(img);
      card.appendChild(contentDiv);
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<p>Greška pri učitavanju događaja.</p>';
    console.error(err);
  }
});
