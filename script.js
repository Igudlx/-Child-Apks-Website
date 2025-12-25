/* ===============================
   PAGE LOAD / ROUTING
   =============================== */

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  // If home page, check auth
  if (path.includes("home.html")) {
    const res = await fetch("/api/check-auth", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();
    if (!data.username) {
      window.location.replace("/index.html");
      return;
    }

    // Update header greeting
    const header = document.getElementById("header-greeting");
    if (header) header.textContent = `Welcome To Child Apks, ${data.username}`;

    // Load paired games
    loadPairedGames();
  }
});

/* ===============================
   AUTH TABS (LOGIN / REGISTER)
   =============================== */

function showAuthTab(id) {
  document.querySelectorAll(".auth-tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===============================
   HOME PAGE TAB SWITCH
   =============================== */

function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ===============================
   LOGIN
   =============================== */

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) return alert("Fill in all fields");

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // Redirect to home after login
    window.location.replace("/home.html");
  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

/* ===============================
   REGISTER
   =============================== */

async function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;

  if (!username || !password) return alert("Fill in all fields");

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Register failed");
      return;
    }

    // Redirect to home after register
    window.location.replace("/home.html");
  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

/* ===============================
   LOGOUT
   =============================== */

async function logout() {
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include"
    });
  } catch (e) { console.error(e); }

  window.location.replace("/index.html");
}

/* ===============================
   PAIR GAME
   =============================== */

async function pairGame() {
  const code = prompt("Enter pairing code from the game:");
  if (!code) return;

  try {
    const res = await fetch("/api/pair-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Pairing failed");

    // Refresh paired games list
    loadPairedGames();
    alert("Game paired successfully!");
  } catch (e) {
    console.error(e);
    alert("Server error");
  }
}

/* ===============================
   LOAD PAIRED GAMES
   =============================== */

async function loadPairedGames() {
  const container = document.getElementById("paired-games");
  if (!container) return;

  try {
    const res = await fetch("/api/get-user-games", {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) {
      container.innerHTML = "<p>Failed to load games</p>";
      return;
    }

    const games = await res.json();
    container.innerHTML = "";

    if (!games.length) {
      container.innerHTML = "<p>No paired games yet.</p>";
      return;
    }

    games.forEach(game => {
      const div = document.createElement("div");
      div.className = "game-card";
      div.textContent = `${game.game_name} — Paired`;
      container.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = "<p>Failed to load games</p>";
  }
}
