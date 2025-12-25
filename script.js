/* ==========================
   TAB SWITCH WITH FADE-IN
========================== */
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
    el.style.opacity = 0;
  });
  const tab = document.getElementById(id);
  tab.classList.remove('hidden');
  let opacity = 0;
  const fade = setInterval(() => {
    opacity += 0.05;
    tab.style.opacity = opacity;
    if (opacity >= 1) clearInterval(fade);
  }, 15);
}

/* ==========================
   COOKIE HELPERS
========================== */
function setCookie(name, value, days) {
  document.cookie = name + "=" + value + "; path=/; max-age=" + (days*24*60*60);
}
function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}
function eraseCookie(name) {
  document.cookie = name+'=; Max-Age=0; path=/';
}

/* ==========================
   UPDATE HEADER GREETING
========================== */
function updateGreeting() {
  const username = getCookie('user');
  const greetingEl = document.getElementById('greeting');
  if (username && greetingEl) {
    greetingEl.textContent = `Welcome To Child Apks, ${username}`;
  }
}

/* ==========================
   ON HOME PAGE LOAD
========================== */
window.addEventListener('DOMContentLoaded', () => {
  // Update greeting if on home page
  if (window.location.pathname.includes('home.html')) {
    updateGreeting();
  }
});

/* ==========================
   LOGIN / REGISTER FUNCTIONS
========================== */
async function register() {
  const username = document.getElementById('register-username')?.value.trim();
  const password = document.getElementById('register-password')?.value;
  if (!username || !password) return alert("Enter a valid username and password");

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  });
  if (res.ok) {
    setCookie('user', username, 7);
    window.location.href = '/home.html';
  } else {
    const text = await res.text();
    document.getElementById('output').textContent = text;
  }
}

async function login() {
  const username = document.getElementById('login-username')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  if (!username || !password) return alert("Enter a valid username and password");

  const res = await fetch('/api/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username, password})
  });

  if (res.ok) {
    const data = await res.json();
    setCookie('user', data.username, 7);
    window.location.href = '/home.html';
  } else {
    const data = await res.json().catch(() => ({error:"Login failed"}));
    document.getElementById('output').textContent = data.error;
  }
}

/* ==========================
   LOGOUT FUNCTION
========================== */
async function logout() {
  try { await fetch('/api/logout'); } catch(e) {}
  eraseCookie('user');
  window.location.href = '/index.html';
}

/* ==========================
   UPDATE USERNAME FUNCTION
========================== */
async function updateUsername() {
  const oldUsername = getCookie('user');
  const newUsername = document.getElementById('new-username')?.value.trim();
  if (!newUsername) return alert("Enter a valid username");

  const res = await fetch('/api/update-username', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({oldUsername, newUsername})
  });

  if (res.ok) {
    setCookie('user', newUsername, 7);
    updateGreeting(); // Update header text immediately
    alert('Username updated!');
  } else {
    alert(await res.text());
  }
}
