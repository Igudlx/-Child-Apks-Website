// Helper for tabs
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// Tab switch on login page
document.getElementById('login-tab').onclick = () => {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
}
document.getElementById('register-tab').onclick = () => {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
}

// Check if user is already logged in
window.onload = () => {
  const user = getCookie('user');
  if (user) window.location.href = '/home.html';
}

// COOKIE HELPERS
function setCookie(name, value, days) {
  document.cookie = name + "=" + value + "; path=/; max-age=" + (days*24*60*60);
}
function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}
function eraseCookie(name) { document.cookie = name+'=; Max-Age=0; path=/'; }

// API calls
async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const res = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password}) });
  const text = await res.text();
  document.getElementById('output').textContent = text;
  if (res.ok) {
    setCookie('user', username, 7);
    window.location.href = '/home.html';
  }
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password}) });
  const data = await res.json().catch(()=>({error:true}));
  if (res.ok) {
    setCookie('user', data.username, 7);
    window.location.href = '/home.html';
  } else {
    document.getElementById('output').textContent = await res.text();
  }
}

async function logout() {
  await fetch('/api/logout');
  eraseCookie('user');
  window.location.href = '/index.html';
}

async function updateUsername() {
  const oldUsername = getCookie('user');
  const newUsername = document.getElementById('new-username').value;
  const res = await fetch('/api/update-username', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({oldUsername,newUsername}) });
  const data = await res.json().catch(()=>({error:true}));
  if (res.ok) {
    setCookie('user', newUsername, 7);
    document.getElementById('greeting').textContent = `Hello ${newUsername}. Welcome To Child Apks`;
    alert('Username updated!');
  } else {
    alert(await res.text());
  }
}

// Display greeting on home page
window.addEventListener('load', () => {
  const user = getCookie('user');
  if (user && document.getElementById('greeting')) {
    document.getElementById('greeting').textContent = `Hello ${user}. Welcome To Child Apks`;
  }
});
