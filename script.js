/* ===== AUTH STORAGE ===== */

function setUser(username) {
  localStorage.setItem("user", username);
}

function getUser() {
  return localStorage.getItem("user");
}

function clearUser() {
  localStorage.removeItem("user");
}

/* ===== PAGE LOAD ==== */

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  const path = window.location.pathname;

  if (!user && path.includes("home")) {
    window.location.replace("/index.html");
    return;
  }

  if (user && path.includes("index")) {
    window.location.replace("/home.html");
    return;
  }

  const greeting = document.getElementById("header-greeting");
  if (user && greeting) {
    greeting.textContent = `Welcome To Child Apks, ${user}`;
  }
});

/* ===== AUTH TABS ===== */

function showAuthTab(id) {
  document.querySelectorAll(".auth-tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===== HOME TABS ===== */

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===== LOGIN ===== */

async function login() {
  const u = document.getElementById("login-username").value;
  const p = document.getElementById("login-password").value;

  if (!u || !p) return alert("Missing fields");

  setUser(u);
  window.location.replace("/home.html");
}

/* ===== REGISTER ===== */

async function register() {
  const u = document.getElementById("register-username").value;
  const p = document.getElementById("register-password").value;

  if (!u || !p) return alert("Missing fields");

  setUser(u);
  window.location.replace("/home.html");
}

/* ===== PAIR GAME ===== */

function pairGame() {
  alert("Pair Game clicked — logic comes next");
}

/* ===== LOGOUT ===== */

function logout() {
  clearUser();
  window.location.replace("/index.html");
}
