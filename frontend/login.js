document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.textContent = data.error || 'Greška prilikom prijave';
      return;
    }

    // Čuvamo token i redirektujemo
    localStorage.setItem('token', data.token);
    console.log('Token koji je sačuvan:', data.token);

    window.location.href = 'dashboard.html';
  } catch (err) {
    errorMessage.textContent = 'Greška sa serverom.';
    console.error(err);
  }
});
