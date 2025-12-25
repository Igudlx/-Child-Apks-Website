import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    try {
        if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

        const gameName = req.query.game_name;
        if (!gameName) return res.status(400).json({ error: "Missing game name" });

        // Get the first unused pairing code for this game
        const result = await sql`
            SELECT code FROM pairing_codes
            WHERE game_name = ${gameName} AND used = false
            ORDER BY created_at ASC
            LIMIT 1
        `;

        if (result.rows.length === 0) return res.status(200).json({ code: "" });

        const code = result.rows[0].code;
        res.status(200).json({ code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
