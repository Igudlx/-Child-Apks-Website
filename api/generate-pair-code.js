// File: /api/generate-pair-code.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the logged-in user from cookies (adjust according to your auth system)
    const username = req.cookies.user; // replace this if you use JWT or session headers
    if (!username) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    // Generate a unique 8-character alphanumeric pairing code
    const code = Math.random().toString(36).substr(2, 8).toUpperCase();

    // Insert the code into the Neon database
    await sql`
      INSERT INTO pairing_codes (code, username, used)
      VALUES (${code}, ${username}, false)
    `;

    // Return the generated code
    return res.status(200).json({ code });

  } catch (err) {
    console.error('Error generating pairing code:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
