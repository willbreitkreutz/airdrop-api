import { all } from "../utils/db.js";

function listPrizes() {
  return all(
    `SELECT * FROM prizes p
      LEFT JOIN games g on p.game_id = g.id
      WHERE g.joinCode = ?`,
    joinCode
  );
}

function getPrize(prizeId) {
  return get(`SELECT * FROM prizes WHERE id = ?`, prizeId);
}

function updatePrize(user, prizeId, prizeValue) {
  return run(
    `UPDATE prizes SET claimed_by = ?, claimed_value = ?, claimed_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [user.id, prizeValue, prizeId]
  );
}

export { getPrize, listPrizes, updatePrize };
