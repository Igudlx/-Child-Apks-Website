import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { email, password } = req.body;

  const result = await sql`
    SELECT password_hash FROM users WHERE email = ${email}
  `;

  if (result.rows.length === 0) {
    return res.status(401).send("Invalid login");
  }

  const valid = await bcrypt.compare(
    password,
    result.rows[0].password_hash
  );

  if (!valid) {
    return res.status(401).send("Invalid login");
  }

  res.json({ success: true });
}
