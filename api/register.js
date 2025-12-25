import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";asasd

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }

  email = email.trim().toLowerCase();

  if (password.length < 6) {
    return res.status(400).send("Password too short");
  }

  try {
    await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${await bcrypt.hash(password, 12)})
    `;

    return res.status(201).send("Account created successfully");
  } catch (err) {
    // 👇 THIS IS THE IMPORTANT PART
    if (err.code === "23505") {
      // unique_violation
      return res.status(409).send("Account already exists");
    }

    console.error("REGISTER ERROR:", err);
    return res.status(500).send("Server error");
  }
}

