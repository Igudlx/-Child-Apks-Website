import crypto from "crypto";
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { gameName } = req.body;
  if (!gameName) return res.status(400).send("Missing game name");

  const code = crypto.randomBytes(3).toString("hex").toUpperCase();

  await sql`
    INSERT INTO pair_codes (code, game_name)
    VALUES (${code}, ${gameName})
  `;

  res.json({ code });
}
