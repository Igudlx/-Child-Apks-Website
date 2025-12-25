import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { username } = req.query;

  const games = await sql`
    SELECT game_name FROM user_games WHERE username=${username}
  `;

  res.json(games.rows);
}
