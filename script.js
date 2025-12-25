/* ===============================
   AUTH STATE (LOCALSTORAGE ONLY)
   =============================== */

function setUser(username) {
  localStorage.setItem("user", username);
}

function getUser() {
  return localStorage.getItem("user");
}

function clearUser() {
  localStorage.removeItem("user");
}

/* ===============================
   PAGE LOAD / ROUTING
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  const path = window.location.pathname;

  // Not logged in -> block home
  if (!user && path.includes("home")) {
    window.location.replace("/index.html");
    return;
  }

  // Logged in -> block login
  if (user && path.includes("index")) {
    window.location.replace("/home.html");
    return;
  }

  // Update header greeting
  const header = document.getElementById("header-greeting");
  if (user && header) {
    header.textContent = `Welcome To Child Apks, ${user}`;
  }

  // Load paired games
  if (user && document.getElementById("paired-games")) {
    renderPairedGames();
  }
});

/* ===============================
   AUTH TAB SWITCH (LOGIN PAGE)
   =============================== */

function showAuthTab(id) {
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

/* ===============================
   HOME TAB SWITCH
   =============================== */

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

/* ===============================
   LOGIN
   =============================== */

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    alert("Fill in all fields");
    return;
  }

  setUser(username);
  window.location.replace("/home.html");
}

/* ===============================
   REGISTER
   =============================== */

function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;

  if (!username || !password) {
    alert("Fill in all fields");
    return;
  }

  setUser(username);
  window.location.replace("/home.html");
}

/* ===============================
   LOGOUT
   =============================== */

function logout() {
  clearUser();
  window.location.replace("/index.html");
}

/* ===============================
   PAIR GAME
   =============================== */

function pairGame() {
  const code = prompt("Enter pairing code from the game:");

  if (!code) return;

  let games = JSON.parse(localStorage.getItem("pairedGames") || "[]");

  games.push({
    name: "Paired Game",
    code: code
  });

  localStorage.setItem("pairedGames", JSON.stringify(games));
  renderPairedGames();
}

/* ===============================
   RENDER PAIRED GAMES
   =============================== */

function renderPairedGames() {
  const container = document.getElementById("paired-games");
  if (!container) return;

  container.innerHTML = "";

  const games = JSON.parse(localStorage.getItem("pairedGames") || "[]");

  if (games.length === 0) {
    container.innerHTML = "<p>No paired games yet.</p>";
    return;
  }

  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.textContent = `Game paired with code: ${game.code}`;
    container.appendChild(div);
  });
}
