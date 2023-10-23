import { all, get, run } from "../utils/db.js";

function prizeToGeoJSON(prize) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [prize.x, prize.y],
    },
    properties: {
      id: prize.id,
      maxValue: prize.max_value,
      startTime: prize.start_time,
      duration: prize.duration,
    },
  };
}

function createPrize({ gameId, startTime, duration, maxValue, x, y }) {
  return run(
    `INSERT INTO prizes (game_id, start_time, duration, max_value, x, y) VALUES (?, ?, ?, ?, ?, ?)`,
    [gameId, startTime, duration, maxValue, x, y]
  );
}

async function getActivePrizes(joinCode) {
  const now = new Date();
  console.log(now.getTime());
  const prizes = await all(
    `SELECT p.id, p.game_id, p.start_time, p.duration, p.max_value, p.x, p.y FROM prizes p
      LEFT JOIN games g on p.game_id = g.id
      WHERE g.join_code = ? and p.claimed_by is null and (? - p.start_time) < duration * 1000`,
    [joinCode, now.getTime()]
  );
  return prizes.map(prizeToGeoJSON);
}

function getPrize(prizeId) {
  return get(`SELECT * FROM prizes WHERE id = ?`, prizeId);
}

async function getPrizeGeoJSON(prizeId) {
  const prize = await getPrize(prizeId);
  return prizeToGeoJSON(prize);
}

function updatePrize(user, prizeId, prizeValue) {
  return run(
    `UPDATE prizes SET claimed_by = ?, claimed_value = ?, claimed_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [user.sub, prizeValue, prizeId]
  );
}

export { createPrize, getPrize, getPrizeGeoJSON, getActivePrizes, updatePrize };
