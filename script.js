// =========================
// Full script.js for Child Apks
// =========================

const apiBase = "/api"; // Vercel API base
let currentUser = null;

// -------------------------
// LOGIN / REGISTER
// -------------------------
async function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const res = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });
        const data = await res.json();
        if (!res.ok) return alert(data.error || "Login failed");
        currentUser = username;
        showHome();
        loadPairedGames();
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

async function registerUser() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    try {
        const res = await fetch(`${apiBase}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include"
        });
        const data = await res.json();
        if (!res.ok) return alert(data.error || "Registration failed");
        currentUser = username;
        showHome();
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

// Toggle between login/register forms
function showLoginForm() {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
}

function showRegisterForm() {
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("login-form").classList.add("hidden");
}

// -------------------------
// HOME / SETTINGS TAB
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

// Show home page after login
function showHome() {
    showTab("home-tab");
    document.getElementById("welcome-header").textContent = `Welcome To Child Apks, ${currentUser}`;
}

// Show settings page
function showSettings() {
    showTab("settings-tab");
}

// Logout
async function logout() {
    await fetch(`${apiBase}/logout`, {
        method: "POST",
        credentials: "include"
    });
    currentUser = null;
    window.location.href = "index.html";
}

// -------------------------
// PAIRED GAMES
// -------------------------
async function requestPairing() {
    const gameName = prompt("Enter your game's name:");
    if (!gameName) return;

    try {
        const res = await fetch(`${apiBase}/request-pairing`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ game_name: gameName })
        });
        const data = await res.json();
        if (!res.ok) return alert(data.error || "Failed to request pairing");

        alert("Send this pairing code to your Unity game: " + data.code);
        loadPairedGames(); // refresh list
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

async function loadPairedGames() {
    const container = document.getElementById("paired-games");
    if (!container) return;

    try {
        const res = await fetch(`${apiBase}/get-user-games`, {
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
        const res = await fetch(`${apiBase}/check-auth`, {
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

// Run checkAuth when the page loads
window.addEventListener("load", checkAuth);
