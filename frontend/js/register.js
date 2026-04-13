const API = 'http://localhost:5000/api';

function show(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}

function hide(id) { document.getElementById(id).classList.remove('show'); }

document.getElementById('registerBtn').addEventListener('click', async () => {
  hide('errorMsg'); hide('successMsg');

  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role     = document.getElementById('role').value;
  const btn      = document.getElementById('registerBtn');

  if (!name || !email || !password) return show('errorMsg', 'All fields are required.');
  if (password.length < 6)          return show('errorMsg', 'Password must be at least 6 characters.');

  btn.disabled = true;
  btn.textContent = 'Creating account…';

  try {
    const res  = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    if (!res.ok) return show('errorMsg', data.message || 'Registration failed.');

    show('successMsg', 'Account created! Redirecting to login…');
    setTimeout(() => window.location.href = 'login.html', 1500);
  } catch {
    show('errorMsg', 'Cannot reach server. Is the backend running?');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
});