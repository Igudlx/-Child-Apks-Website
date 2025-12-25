import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { game_name } = await req.json();
    const username = req.cookies.user;
    if (!username) return res.status(401).json({ error: "Not logged in" });

    // Generate a random 8-char pairing code
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();

    // Store it in Neon, marked as pending
    await sql`
      INSERT INTO pairing_codes (code, username, game_name, used)
      VALUES (${code}, ${username}, ${game_name}, false)
    `;

    // Return the code to the website (to show to user)
    res.status(200).json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
