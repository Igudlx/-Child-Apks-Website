import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { oldUsername, newUsername } = req.body;
  if (!oldUsername || !newUsername) return res.status(400).send("Missing fields");

  try {
    await sql`UPDATE users SET username=${newUsername.toLowerCase()} WHERE username=${oldUsername.toLowerCase()}`;
    res.setHeader("Set-Cookie", `user=${newUsername.toLowerCase()}; HttpOnly; Path=/; Max-Age=604800`);
    return res.json({ success: true, newUsername });
  } catch (err) {
    if (err.code === "23505") return res.status(409).send("Username already exists");
    console.error("UPDATE USERNAME ERROR:", err);
    return res.status(500).send("Server error");
  }
}
