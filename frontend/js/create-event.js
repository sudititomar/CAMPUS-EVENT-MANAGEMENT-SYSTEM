const API = 'http://localhost:5000/api';

// ── Auth guard — organizers only ──
const token = localStorage.getItem('token');
const user  = JSON.parse(localStorage.getItem('user') || 'null');
if (!token || !user) window.location.href = 'login.html';
if (user.role === 'student') {
  alert('Only organizers can create events.');
  window.location.href = 'dashboard.html';
}

// ── Populate sidebar ──
document.getElementById('userName').textContent     = user.name;
document.getElementById('userRole').textContent     = user.role;
document.getElementById('avatarInitial').textContent = user.name[0].toUpperCase();

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

// ── Alert helpers ──
function show(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}
function hide(id) { document.getElementById(id).classList.remove('show'); }

// ── Create event ──
document.getElementById('createBtn').addEventListener('click', async () => {
  hide('errorMsg'); hide('successMsg');

  const title       = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const location    = document.getElementById('location').value.trim();
  const capacity    = document.getElementById('capacity').value;
  const date        = document.getElementById('date').value;
  const btn         = document.getElementById('createBtn');

  if (!title || !location || !date) return show('errorMsg', 'Title, location, and date are required.');

  btn.disabled = true;
  btn.textContent = 'Publishing…';

  try {
    const res  = await fetch(`${API}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, location, capacity: Number(capacity) || 100, date })
    });

    const data = await res.json();
    if (!res.ok) return show('errorMsg', data.message || 'Failed to create event.');

    show('successMsg', 'Event published! Redirecting…');
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
  } catch {
    show('errorMsg', 'Server error. Is the backend running?');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Publish Event';
  }
});