document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
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

    if (!res.ok) {
      const error = await res.json();
      console.error('Greška sa servera:', error);
      eventsList.innerHTML = `<p>Greška: ${error.error || 'Neuspešno učitavanje događaja'}</p>`;
      return;
    }

    const events = await res.json();

    if (events.length === 0) {
      eventsList.innerHTML = '<p>Nema događaja.</p>';
      return;
    }

    eventsList.innerHTML = '';

    events.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('event-card-dash');

      eventDiv.innerHTML = `
        <h3 class="dashboard-title">${event.title}</h3>
        <p class="dashboard-description">${event.description}</p>
        <p class="dashboard-date"><strong>Datum:</strong> ${new Date(event.event_date).toLocaleDateString('sr-RS')}</p>
        <button class="dashboard-edit" onclick="editEvent(${event.id})">Izmeni</button>
        <button class="dashboard-delete" onclick="deleteEvent(${event.id})">Obriši</button>
        <div class="table-map-title">
          <h3>Raspored stolova</h3>
        </div>
        <div class="table-map">
          <div class="tables-grid" id="tables-grid-${event.id}"></div>
        </div>
      `;

      eventsList.appendChild(eventDiv);

      // ➕ Dodaj prikaz šeme stolova
      prikaziSemuStolova(event);
    });

  } catch (err) {
    console.error('Greška prilikom poziva API-ja:', err);
    eventsList.innerHTML = '<p>Došlo je do greške na serveru.</p>';
  }
});

document.getElementById('addEventBtn').addEventListener('click', () => {
  window.location.href = 'eventForm.html';
});

function editEvent(id) {
  window.location.href = `eventForm.html?id=${id}`;
}

/// Brisanje eventa sa dashboard admin panela
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
      alert('Događaj je uspešno obrisan.');
      location.reload();
    } else {
      const error = await res.json();
      alert(`Greška: ${error.error || 'Nije moguće obrisati događaj.'}`);
      console.error('Greška pri brisanju:', error);
    }
  } catch (err) {
    console.error('Greška pri komunikaciji sa serverom:', err);
    alert('Greška pri komunikaciji sa serverom.');
  }
}

// Prikaz šeme stolova sa klik funkcijom za menadžere
function prikaziSemuStolova(event) {
  const eventId = event.id;
  const venueName = event.venue_name;
  const gridElement = document.getElementById(`tables-grid-${eventId}`);

  Promise.all([
    fetch(`http://localhost:3000/api/tables/${venueName}`).then(res => res.json()),
    fetch(`http://localhost:3000/api/tables/reserved/${eventId}`).then(res => res.json())
  ])
  .then(([allTables, reservedTables]) => {
    const reservedIds = reservedTables.map(t => t.id);
    gridElement.innerHTML = '';

    allTables.forEach(table => {
      const div = document.createElement('div');
      div.className = 'table-cell';
      div.textContent = table.table_number;
      div.setAttribute('data-id', table.id);

      if (reservedIds.includes(table.id)) {
        div.classList.add('reserved');
      } else {
        div.classList.add('available');
      }

      // Klik na sto – prikaži info
      div.addEventListener('click', async () => {
        if (reservedIds.includes(table.id)) {
          try {
            const res = await fetch(`http://localhost:3000/api/reservations/table/${table.id}/event/${eventId}`);
            const data = await res.json();
            document.getElementById('modalFullName').textContent = data.full_name;
            document.getElementById('modalEmail').textContent = data.email;
            document.getElementById('modalPhone').textContent = data.phone_number;
            document.getElementById('modalPeople').textContent = data.number_of_people;

            document.getElementById('reservationModal').style.display = 'block';
          } catch (err) {
            alert('Greška pri dohvatanju rezervacije.');
            console.error(err);
          }
        } else {
          const slobodni = allTables.filter(t => !reservedIds.includes(t.id));
            showFreeTablesModal(slobodni);        
        }
      });

      gridElement.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Greška pri učitavanju stolova:', err);
  });
}
// Modal za slobodne stolove
function showFreeTablesModal(freeTables) {
  const modal = document.getElementById('freeTablesModal');
  const list = document.getElementById('free-tables-list');
  list.innerHTML = '';

  freeTables.forEach(table => {
    const li = document.createElement('li');
    li.textContent = `Sto ${table.table_number}`;
    list.appendChild(li);
  });

  modal.style.display = 'block';
}

document.getElementById('closeFreeModal').addEventListener('click', () => {
  document.getElementById('freeTablesModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
  const modal = document.getElementById('freeTablesModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


//Odjava sa dashboard admin panela
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('reservationModal').style.display = 'none';
});

// Zatvori modal klikom van kutije
window.addEventListener('click', (event) => {
  const modal = document.getElementById('reservationModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
