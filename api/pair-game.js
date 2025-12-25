import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = await req.json();
    const { code } = body;

    if (!code) return res.status(400).json({ error: 'Missing code' });

    // Replace this with your sessiocheck logic
    const username = req.cookies.user || null;
    if (!username) return res.status(401).json({ error: 'Not logged in' });

    // Insert paired game into Neon
    await sql`INSERT INTO paired_games (username, code) VALUES (${username}, ${code})`;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
