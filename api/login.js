import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  let { username, password } = req.body;
  username = username.trim().toLowerCase();

  const result = await sql`SELECT * FROM users WHERE username=${username}`;

  if (result.rows.length === 0) return res.status(401).send("Invalid login");

  const valid = await bcrypt.compare(password, result.rows[0].password_hash);
  if (!valid) return res.status(401).send("Invalid login");

  // Set a cookie to stay logged in
  res.setHeader("Set-Cookie", `user=${username}; HttpOnly; Path=/; Max-Age=604800`); // 7 days

  return res.json({ success: true, username });
}
