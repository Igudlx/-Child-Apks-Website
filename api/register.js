import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }

  if (password.length < 6) {
    return res.status(400).send("Password too short");
  }

  const hash = await bcrypt.hash(password, 12);

  try {
    await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${hash})
    `;
  } catch {
    return res.status(409).send("Account already exists");
  }

  res.status(201).send("Account created successfully");
}
