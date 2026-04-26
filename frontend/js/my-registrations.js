const API   = 'http://localhost:5000/api';
const token = localStorage.getItem('token');
const user  = JSON.parse(localStorage.getItem('user') || 'null');

// ── Auth guard — students only ──
if (!token || !user) window.location.href = 'login.html';

// ── Populate sidebar ──
document.getElementById('userName').textContent      = user.name;
document.getElementById('userRole').textContent      = user.role;
document.getElementById('avatarInitial').textContent = user.name[0].toUpperCase();

if (user.role === 'organizer' || user.role === 'admin') {
  document.getElementById('createLink').style.display = 'flex';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

// ── Format date ──
function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium', timeStyle: 'short'
  });
}

// ── Countdown timer ──
function startCountdown(eventDate, containerId) {
  const target = new Date(eventDate).getTime();

  function tick() {
    const now  = Date.now();
    const diff = target - now;
    const el   = document.getElementById(containerId);
    if (!el) return; // card removed from DOM

    // Event already ended (allow 1hr grace)
    if (diff < -3600000) {
      el.innerHTML = '<p class="countdown-ended">🔴 Event Ended</p>';
      return;
    }

    // Event started (within the hour)
    if (diff <= 0) {
      el.innerHTML = '<p class="countdown-started">🟢 Event Started!</p>';
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    el.innerHTML = `
      <div class="countdown-box">
        <div class="countdown-unit"><span>${days}</span><small>Days</small></div>
        <div class="countdown-unit"><span>${hours}</span><small>Hrs</small></div>
        <div class="countdown-unit"><span>${minutes}</span><small>Mins</small></div>
        <div class="countdown-unit"><span>${seconds}</span><small>Secs</small></div>
      </div>`;
  }

  tick(); // run immediately
  return setInterval(tick, 1000);
}

// ── Render registration cards ──
function renderRegistrations(registrations) {
  const grid = document.getElementById('registrationsGrid');

  if (!registrations.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="icon">🎟️</div>
        <h3>No registrations yet</h3>
        <p>Go to <a href="dashboard.html">All Events</a> and register for one!</p>
      </div>`;
    return;
  }

  grid.innerHTML = registrations.map((reg, i) => {
    const ev = reg.event;
    return `
      <div class="event-card" style="animation-delay:${i * 0.06}s">
        <span class="event-card-tag">📍 ${ev.location}</span>
        <h3>${ev.title}</h3>
        <div class="event-meta">
          <span>🗓️ <strong>${fmtDate(ev.date)}</strong></span>
        </div>
        <div id="countdown-${reg._id}"></div>
        <div class="event-card-footer">
          <span class="capacity-badge">✅ Registered</span>
        </div>
      </div>`;
  }).join('');

  // Start countdown for each card after DOM is ready
  registrations.forEach(reg => {
    startCountdown(reg.event.date, 'countdown-' + reg._id);
  });
}

// ── Fetch my registrations ──
async function loadRegistrations() {
  try {
    const res  = await fetch(`${API}/registrations/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    renderRegistrations(data);
  } catch {
    document.getElementById('registrationsGrid').innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <h3>Could not load registrations</h3>
        <p>Make sure the backend server is running.</p>
      </div>`;
  }
}

loadRegistrations();