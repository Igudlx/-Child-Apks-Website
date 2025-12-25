import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, code } = req.body;

  const result = await sql`
    SELECT * FROM pair_codes WHERE code=${code}
  `;

  if (result.rowCount === 0) {
    return res.status(400).send("Invalid or expired code");
  }

  const gameName = result.rows[0].game_name;

  await sql`
    INSERT INTO user_games (username, game_name)
    VALUES (${username}, ${gameName})
  `;

  await sql`
    DELETE FROM pair_codes WHERE code=${code}
  `;

  res.send("Game paired!");
}
