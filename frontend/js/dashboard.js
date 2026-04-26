const API = 'http://localhost:5000/api';

// ── Auth guard ──
const token = localStorage.getItem('token');
const user  = JSON.parse(localStorage.getItem('user') || 'null');
if (!token || !user) window.location.href = 'login.html';

// ── Populate sidebar user chip ──
document.getElementById('userName').textContent     = user.name;
document.getElementById('userRole').textContent     = user.role;
document.getElementById('avatarInitial').textContent = user.name[0].toUpperCase();

// Show "Create Event" link for organizers/admins
if (user.role === 'organizer' || user.role === 'admin') {
  document.getElementById('createLink').style.display = 'flex';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

// ── Alert helpers ──
function showAlert(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Format date ──
function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium', timeStyle: 'short'
  });
}

// ── Render event cards ──
function renderEvents(events) {
  const grid = document.getElementById('eventsGrid');

  if (!events.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="icon">📭</div>
        <h3>No events yet</h3>
        <p>Check back later for upcoming campus events.</p>
      </div>`;
    return;
  }

  const isStudent   = user.role === 'student';
  const isOrganizer = user.role === 'organizer' || user.role === 'admin';

  grid.innerHTML = events.map((ev, i) => {
    const registerBtn = isStudent
      ? '<button class="btn btn-outline btn-sm" onclick="registerEvent(\'' + ev._id + '\', this)">Register</button>'
      : '';

    const participantsBtn = isOrganizer
      ? '<button class="btn btn-outline btn-sm" onclick="viewParticipants(\'' + ev._id + '\', \'' + ev.title + '\')">👥 Participants</button>'
      : '';

    return `
      <div class="event-card" style="animation-delay:${i * 0.06}s">
        <span class="event-card-tag">📍 ${ev.location}</span>
        <h3>${ev.title}</h3>
        <p class="desc">${ev.description || 'No description provided.'}</p>
        <div class="event-meta">
          <span>🗓️ <strong>${fmtDate(ev.date)}</strong></span>
          <span>👤 <strong>${ev.organizer?.name || 'Unknown'}</strong></span>
        </div>
        <div class="event-card-footer">
          <span class="capacity-badge">👥 Capacity: ${ev.capacity}</span>
          ${registerBtn}
          ${participantsBtn}
        </div>
      </div>`;
  }).join('');
}

// ── Register for event ──
async function registerEvent(eventId, btn) {
  btn.disabled = true;
  btn.textContent = 'Registering…';

  try {
    const res  = await fetch(`${API}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ eventId })
    });

    const data = await res.json();
    if (!res.ok) {
      showAlert('errorMsg', data.message || 'Registration failed.');
      btn.disabled = false;
      btn.textContent = 'Register';
      return;
    }

    btn.textContent = '✓ Registered';
    btn.style.color = 'var(--success)';
    btn.style.borderColor = 'var(--success)';
    showAlert('successMsg', 'Successfully registered for the event!');
  } catch {
    showAlert('errorMsg', 'Server error. Try again.');
    btn.disabled = false;
    btn.textContent = 'Register';
  }
}

// ── Fetch events ──
async function loadEvents() {
  try {
    const res    = await fetch(`${API}/events`);
    const events = await res.json();
    renderEvents(events);
  } catch {
    document.getElementById('eventsGrid').innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <h3>Could not load events</h3>
        <p>Make sure the backend server is running on port 5000.</p>
      </div>`;
  }
}

// ── View Participants Modal ──
async function viewParticipants(eventId, eventTitle) {
  try {
    const res  = await fetch(`${API}/events/${eventId}/participants`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    const rows = data.length
      ? data.map((p, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${p.name}</td>
            <td>${p.email}</td>
            <td>${new Date(p.registeredAt).toLocaleString('en-IN')}</td>
          </tr>`).join('')
      : '<tr><td colspan="4" style="text-align:center">No registrations yet.</td></tr>';

    document.getElementById('participantsModal').innerHTML = `
      <div class="modal-overlay" onclick="closeModal()">
        <div class="modal-box" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>👥 ${eventTitle}</h3>
            <button onclick="closeModal()" class="modal-close">✕</button>
          </div>
          <p style="margin-bottom:12px;color:var(--text-muted)">${data.length} participant(s)</p>
          <div class="table-wrap">
            <table class="participants-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Registered At</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>`;

    document.getElementById('participantsModal').style.display = 'block';
  } catch {
    showAlert('errorMsg', 'Failed to load participants.');
  }
}

function closeModal() {
  document.getElementById('participantsModal').style.display = 'none';
}

loadEvents();
