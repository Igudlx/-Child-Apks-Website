/* ==========================
   DOM READY
========================== */
window.addEventListener("DOMContentLoaded", () => {
  updateGreeting();
  loadGames();
});

/* ==========================
   TAB SWITCH
========================== */
function showTab(id) {
  document.querySelectorAll(".tab-content").forEach(el => {
    el.classList.add("hidden");
    el.style.opacity = 0;
  });

  const tab = document.getElementById(id);
  tab.classList.remove("hidden");

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
function getCookie(name) {
  const v = document.cookie.match("(^|;) ?"+name+"=([^;]*)(;|$)");
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  document.cookie = `${name}=${value}; path=/; max-age=${days*86400}`;
}

function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=0; path=/";
}

/* ==========================
   GREETING
========================== */
function updateGreeting() {
  const username = getCookie("user");
  const greeting = document.getElementById("greeting");

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
  document.getElementById("pairModal").classList.remove("hidden");
}

function closePairModal() {
  document.getElementById("pairModal").classList.add("hidden");
}

/* ==========================
   PAIR GAME
========================== */
async function pairGame() {
  const code = document.getElementById("pairCodeInput").value.trim();
  const username = getCookie("user");

  if (!code) {
    alert("Enter a code");
    return;
  }

  const res = await fetch("/api/pair-game", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ username, code })
  });

  if (res.ok) {
    closePairModal();
    document.getElementById("pairCodeInput").value = "";
    loadGames();
    alert("Game paired successfully!");
  } else {
    alert(await res.text());
  }
}

/* ==========================
   LOAD USER GAMES
========================== */
async function loadGames() {
  const username = getCookie("user");
  const container = document.getElementById("games");

  if (!container) return;

  const res = await fetch(`/api/get-user-games?username=${username}`);
  const games = await res.json();

  container.innerHTML = "";

  if (games.length === 0) {
    container.innerHTML = "<p>No games paired yet.</p>";
    return;
  }

  games.forEach(g => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.textContent = g.game_name;
    container.appendChild(card);
  });
}

/* ==========================
   UPDATE USERNAME
========================== */
async function updateUsername() {
  const newUsername = document.getElementById("new-username").value.trim();
  const oldUsername = getCookie("user");

  if (!newUsername) {
    alert("Enter a username");
    return;
  }

  const res = await fetch("/api/update-username", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ oldUsername, newUsername })
  });

  if (res.ok) {
    setCookie("user", newUsername, 7);
    updateGreeting();
    alert("Username updated!");
  } else {
    alert(await res.text());
  }
}

/* ==========================
   LOGOUT
========================== */
function logout() {
  eraseCookie("user");
  window.location.href = "/index.html";
}
