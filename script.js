/* ==========================
   GLOBAL ERROR GUARD
========================== */
window.onerror = function (msg, url, line) {
  console.error("JS ERROR:", msg, "Line:", line);
  return false;
};

/* ==========================
   DOM READY
========================== */
window.addEventListener("DOMContentLoaded", () => {
  setupAuthTabs();
  setupAuthForms();
  safeUpdateGreeting();
  safeLoadGames();
});

/* ==========================
   LOGIN / REGISTER TAB SWITCH
========================== */
function setupAuthTabs() {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (!loginTab || !registerTab || !loginForm || !registerForm) return;

  loginTab.onclick = () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  };

  registerTab.onclick = () => {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  };
}

/* ==========================
   PREVENT FORM RELOADS
========================== */
function setupAuthForms() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      login();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      register();
    });
  }
}

/* ==========================
   TAB SWITCH (HOME)
========================== */
function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.add("hidden");
    el.style.opacity = 0;
  });

  const tab = document.getElementById(id);
  if (!tab) return;

  tab.classList.remove("hidden");

  let o = 0;
  const fade = setInterval(() => {
    o += 0.05;
    tab.style.opacity = o;
    if (o >= 1) clearInterval(fade);
  }, 15);
}

/* ==========================
   COOKIE HELPERS
========================== */
function getCookie(name) {
  const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  document.cookie = `${name}=${value}; path=/; max-age=${days * 86400}`;
}

function eraseCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

/* ==========================
   LOGIN
========================== */
async function login() {
  const username = document.getElementById("login-username")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    setCookie("user", data.username, 7);
    window.location.href = "/home.html";
  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

/* ==========================
   REGISTER
========================== */
async function register() {
  const username = document.getElementById("register-username")?.value.trim();
  const password = document.getElementById("register-password")?.value;

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    setCookie("user", username, 7);
    window.location.href = "/home.html";
  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

/* ==========================
   GREETING
========================== */
function safeUpdateGreeting() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  const username = getCookie("user");
  if (!username) {
    window.location.href = "/index.html";
    return;
  }

  greeting.textContent = `Welcome To Child Apks, ${username}`;
}

/* ==========================
   PAIR MODAL
========================== */
function openPairModal() {
  document.getElementById("pairModal")?.classList.remove("hidden");
}

function closePairModal() {
  document.getElementById("pairModal")?.classList.add("hidden");
}

/* ==========================
   PAIR GAME
========================== */
async function pairGame() {
  const code = document.getElementById("pairCodeInput")?.value.trim();
  const username = getCookie("user");

  if (!code) return alert("Enter a code");

  try {
    const res = await fetch("/api/pair-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, code })
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    closePairModal();
    safeLoadGames();
    alert("Game paired!");
  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

/* ==========================
   LOAD GAMES
========================== */
async function safeLoadGames() {
  const container = document.getElementById("games");
  if (!container) return;

  const username = getCookie("user");
  if (!username) return;

  try {
    const res = await fetch(`/api/get-user-games?username=${username}`);
    if (!res.ok) {
      container.innerHTML = "<p>Error loading games</p>";
      return;
    }

    const games = await res.json();
    container.innerHTML = "";

    if (!games.length) {
      container.innerHTML = "<p>No games paired yet.</p>";
      return;
    }

    games.forEach(g => {
      const div = document.createElement("div");
      div.className = "game-card";
      div.textContent = g.game_name;
      container.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Failed to load games</p>";
  }
}

/* ==========================
   UPDATE USERNAME
========================== */
async function updateUsername() {
  const input = document.getElementById("new-username");
  if (!input) return;

  const newUsername = input.value.trim();
  const oldUsername = getCookie("user");

  if (!newUsername) return alert("Enter a username");

  try {
    const res = await fetch("/api/update-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldUsername, newUsername })
    });

    if (!res.ok) {
      alert(await res.text());
      return;
    }

    setCookie("user", newUsername, 7);
    safeUpdateGreeting();
    alert("Username updated!");
  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

/* ==========================
   LOGOUT
========================== */
function logout() {
  eraseCookie("user");
  window.location.href = "/index.html";
}
