import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

        const { code, game_name } = await req.json();
        const username = req.cookies.user; // logged-in user
        if (!username) return res.status(401).json({ error: "Not logged in" });

        // Mark the pairing code as used and store the game name for the user
        await sql`
            UPDATE pairing_codes
            SET used = true
            WHERE code = ${code} AND username = ${username}
        `;

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
