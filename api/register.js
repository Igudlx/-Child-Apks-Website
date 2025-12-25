import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  let { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing username or password");

  username = username.trim().toLowerCase();

  if (password.length < 6) return res.status(400).send("Password too short");

  try {
    await sql`
      INSERT INTO users (username, password_hash)
      VALUES (${username}, ${await bcrypt.hash(password, 12)})
    `;
    return res.status(201).json({ success: true, username });
  } catch (err) {
    if (err.code === "23505") return res.status(409).send("Username already exists");
    console.error("REGISTER ERROR:", err);
    return res.status(500).send("Server error");
  }
}
