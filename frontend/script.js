document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('events-container');
  const filterContainer = document.getElementById('day-filter');
  const days = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 (nedelja) do 6 (subota)
    const diff = (day === 0 ? -6 : 1) - day; // pomera na ponedeljak
    d.setDate(d.getDate() + diff);
    return d;
  }

  function formatDate(date) {
    return date.toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: 'short'
    });
  }

  function createDayFilter(selectedDate, events) {
    filterContainer.innerHTML = '';
    const monday = getStartOfWeek(new Date());

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const isoDate = current.toISOString().split('T')[0];

      const dayBlock = document.createElement('div');
      dayBlock.className = 'day-block';
      dayBlock.dataset.date = isoDate;
      dayBlock.innerHTML = `
        <div>${days[i]}</div>
        <div>${formatDate(current)}</div>
      `;

      dayBlock.addEventListener('click', () => {
        document.querySelectorAll('.day-block').forEach(el => el.classList.remove('active'));
        dayBlock.classList.add('active');
        displayEvents(events, isoDate);
      });

      if (isoDate === selectedDate) {
        dayBlock.classList.add('active');
      }

      filterContainer.appendChild(dayBlock);
    }
  }

function displayEvents(events, filterDate) {
  container.innerHTML = '';

  const filteredEvents = events.filter(event => {
    const eventDateObj = new Date(event.event_date);
    const filterDateObj = new Date(filterDate);

    return (
      eventDateObj.getFullYear() === filterDateObj.getFullYear() &&
      eventDateObj.getMonth() === filterDateObj.getMonth() &&
      eventDateObj.getDate() === filterDateObj.getDate()
    );
  });

  if (filteredEvents.length === 0) {
    container.innerHTML = '<p>Nema događaja za izabrani dan.</p>';
    return;
  }

  filteredEvents.forEach(event => {
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
    rezervisiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open(`event.html?id=${event.id}`);
    });

    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    contentDiv.appendChild(date);
    contentDiv.appendChild(rezervisiBtn);

    card.appendChild(img);
    card.appendChild(contentDiv);
    container.appendChild(card);
  });
}


  // 🟢 Glavni deo koji sve pokreće
  try {
    const res = await fetch('http://localhost:3000/api/events');
    const events = await res.json();
    const today = new Date().toISOString().split('T')[0];

    createDayFilter(today, events);
    displayEvents(events, today);
  } catch (err) {
    container.innerHTML = '<p>Greška pri učitavanju događaja.</p>';
    console.error(err);
  }
});
