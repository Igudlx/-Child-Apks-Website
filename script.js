/* =========================
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
   LOGIN PAGE TAB SWITCH
========================== */
document.getElementById('login-tab')?.addEventListener('click', () => {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
});
document.getElementById('register-tab')?.addEventListener('click', () => {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
});

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
   CHECK IF USER ALREADY LOGGED IN
========================== */
window.onload = () => {
  const username = getCookie('user');
  if (username && window.location.pathname.includes('index.html')) {
    window.location.href = '/home.html';
  }

  // Set greeting if on home page
  if (username && document.getElementById('greeting')) {
    document.getElementById('greeting').textContent = `Welcome To Child Apks, ${username}`;
  }
};

/* ==========================
   REGISTER FUNCTION
========================== */
async function register() {
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;

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
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;

  if (!username || !password) return alert("Enter a valid username and password");

  try {
    const res = await fetch('/api/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username, password})
    });

    const data = await res.json().catch(() => ({error:true}));

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
  try {
    await fetch('/api/logout');
  } catch(err) { console.error(err); }
  eraseCookie('user');
  window.location.href = '/index.html';
}

/* ==========================
   UPDATE USERNAME FUNCTION
========================== */
async function updateUsername() {
  const oldUsername = getCookie('user');
  const newUsername = document.getElementById('new-username').value.trim();

  if (!newUsername) return alert("Enter a valid username");

  try {
    const res = await fetch('/api/update-username', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({oldUsername, newUsername})
    });

    if (res.ok) {
      setCookie('user', newUsername, 7);
      document.getElementById('greeting').textContent = `Welcome To Child Apks, ${newUsername}`;
      alert('Username updated!');
    } else {
      alert(await res.text());
    }
  } catch(err) {
    console.error(err);
    alert("Server error");
  }
}
