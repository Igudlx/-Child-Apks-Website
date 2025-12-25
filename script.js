/* ==========================
   WAIT FOR DOM TO LOAD
========================== */
window.addEventListener('DOMContentLoaded', () => {
  setupAuthTabs();
  setupGreeting();
});

/* ==========================
   LOGIN / REGISTER TAB SWITCH
========================== */
function setupAuthTabs() {
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginTab && registerTab && loginForm && registerForm) {
    loginTab.addEventListener('click', () => {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    });
  }
}

/* ==========================
   TAB SWITCH WITH FADE-IN (HOME)
========================== */
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
    el.style.opacity = 0;
  });
  const tab = document.getElementById(id);
  if (tab) {
    tab.classList.remove('hidden');
    let opacity = 0;
    const fade = setInterval(() => {
      opacity += 0.05;
      tab.style.opacity = opacity;
      if (opacity >= 1) clearInterval(fade);
    }, 15);
  }
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
   UPDATE GREETING
========================== */
function setupGreeting() {
  const username = getCookie('user');

  // Redirect logged-in users from login page
  if (username && window.location.pathname.includes('index.html')) {
    window.location.href = '/home.html';
  }

  // Update greeting on home page
  const greetingEl = document.getElementById('greeting');
  if (username && greetingEl) {
    greetingEl.textContent = `Welcome To Child Apks, ${username}`;
  }
}

/* ==========================
   REGISTER FUNCTION
========================== */
async function register() {
  const username = document.getElementById('register-username')?.value.trim();
  const password = document.getElementById('register-password')?.value;

  if (!username || !password) return alert("Enter a valid username and password");

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username, password})
    });

    const text = await res.text();
    document.getElementById('output').textContent = text;

    if (res.ok) {
      setCookie('user', username, 7);
      window.location.href = '/home.html';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('output').textContent = "Server error";
  }
}

/* ==========================
   LOGIN FUNCTION
========================== */
async function login() {
  const username = document.getElementById('login-username')?.value.trim();
  const password = document.getElementById('login-password')?.value;

  if (!username || !password) return alert("Enter a valid username and password");

  try {
    const res = await fetch('/api/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username, password})
    });

    const data = await res.json().catch(() => ({error:"Login failed"}));

    if (res.ok) {
      setCookie('user', data.username, 7);
      window.location.href = '/home.html';
    } else {
      document.getElementById('output').textContent = data.error || "Login failed";
    }
  } catch(err) {
    console.error(err);
    document.getElementById('output').textContent = "Server error";
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

  try {
    const res = await fetch('/api/update-username', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({oldUsername, newUsername})
    });

    if (res.ok) {
      setCookie('user', newUsername, 7);
      const greetingEl = document.getElementById('greeting');
      if (greetingEl) greetingEl.textContent = `Welcome To Child Apks, ${newUsername}`;
      alert('Username updated!');
    } else {
      alert(await res.text());
    }
  } catch(err) {
    console.error(err);
    alert("Server error");
  }
}
