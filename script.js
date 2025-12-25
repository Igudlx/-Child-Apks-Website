// -------------------------
// HOME / SETTINGS TAB LOGIC
// -------------------------
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

function showHome() {
  showTab("home-tab");
  if (currentUser) {
    document.getElementById("welcome-header").textContent = `Welcome To Child Apks, ${currentUser}`;
  }
}

function showSettings() {
  showTab("settings-tab");
}

// -------------------------
// PAIR GAME / PAIRED GAMES
// -------------------------
async function requestPairing() {
  const gameName = prompt("Enter your game's name:");
  if (!gameName) return;

  try {
    const res = await fetch("/api/request-pairing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ game_name: gameName })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed to request pairing");

    alert("Send this pairing code to your Unity game: " + data.code);
    loadPairedGames();
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

async function loadPairedGames() {
  const container = document.getElementById("paired-games");
  if (!container) return;

  try {
    const res = await fetch("/api/get-user-games", {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No paired games yet.</p>";
      return;
    }

    data.forEach(game => {
      const div = document.createElement("div");
      div.className = "game-card";
      div.textContent = `${game.game_name} — Paired`;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load games</p>";
  }
}

// -------------------------
// CHECK LOGIN ON PAGE LOAD
// -------------------------
async function checkAuth() {
  try {
    const res = await fetch("/api/check-auth", {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();
    if (res.ok && data.username) {
      currentUser = data.username;
      showHome();
      loadPairedGames();
    }
  } catch (err) {
    console.error(err);
  }
}

window.addEventListener("load", checkAuth);
