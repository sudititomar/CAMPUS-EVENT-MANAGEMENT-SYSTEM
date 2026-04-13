const API = 'http://localhost:5000/api';

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.classList.add('show');
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn      = document.getElementById('loginBtn');

  if (!email || !password) return showError('Please fill in all fields.');

  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) return showError(data.message || 'Login failed.');

    // Save token + user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));

    window.location.href = 'dashboard.html';
  } catch {
    showError('Cannot reach server. Is the backend running?');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
});