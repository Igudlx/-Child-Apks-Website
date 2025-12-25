/* ================================
   AUTH STORAGE (LOCALSTORAGE ONLY)
   ================================ */

function setUser(username) {
  localStorage.setItem("user", username);
}

function getUser() {
  return localStorage.getItem("user");
}

function clearUser() {
  localStorage.removeItem("user");
}

/* ================================
   PAGE LOAD HANDLING
   ================================ */

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const username = getUser();

  // If logged in and on login page → go home
  if (username && (path.endsWith("/") || path.endsWith("index.html"))) {
    window.location.replace("/home.html");
    return;
  }

  // If not logged in and on home → go login
  if (!username && path.endsWith("home.html")) {
    window.location.replace("/index.html");
    return;
  }

  // If on home and logged in → update header greeting
  if (username && document.getElementById("header-greeting")) {
    document.getElementById("header-greeting").textContent =
      `Welcome To Child Apks, ${username}`;
  }
});

/* ================================
   TAB SWITCHING (LOGIN / REGISTER)
   ================================ */

function showAuthTab(tabId) {
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.classList.add("hidden");
  });

  document.getElementById(tabId).classList.remove("hidden");
}

/* ================================
   TAB SWITCHING (HOME PAGE)
   ================================ */

function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.add("hidden");
  });

  document.getElementById(tabId).classList.remove("hidden");
}

/* ================================
   LOGIN
   ================================ */

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    alert(await res.text());
    return;
  }

  setUser(username);
  window.location.replace("/home.html");
}

/* ================================
   REGISTER
   ================================ */

async function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;

  if (!username || !password) {
    alert("Please fill in all fields");
    return;
  }

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    alert(await res.text());
    return;
  }

  setUser(username);
  window.location.replace("/home.html");
}

/* ================================
   LOGOUT
   ================================ */

function logout() {
  clearUser();
  window.location.replace("/index.html");
}
