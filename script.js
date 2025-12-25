// =========================
// Child Apks — Full script.js
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
        window.location.href = "home.html"; // redirect to home after login
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
        window.location.href = "home.html"; // redirect to home after register
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

// Toggle forms
function showLoginForm() {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
}

function showRegisterForm() {
    document.getElementById("register-form").classList.remove("hidden");
    document.getElementById("login-form").classList.add("hidden");
}

// -------------------------
// HOME / SETTINGS TABS
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
    const header = document.getElementById("welcome-header");
    if (header && currentUser) header.textContent = `Welcome To Child Apks, ${currentUser}`;
}

function showSettings() {
    showTab("settings-tab");
}

async function logout() {
    await fetch(`${apiBase}/logout`, {
        method: "POST",
        credentials: "include"
    });
    currentUser = null;
    window.location.href = "index.html";
}

// -------------------------
// PAIR GAME
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
// CHECK LOGIN
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

window.addEventListener("load", () => {
    // Only run checkAuth on home.html
    if (document.getElementById("welcome-header")) checkAuth();
});
