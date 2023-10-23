import { get, all, run } from "../utils/db.js";

function getUserLeaderboardInfo(joinCode, userId) {
  return get(
    `SELECT u.username, gu.score, gu.last_location as position FROM games_users gu
      LEFT JOIN users u on gu.user_id = u.id
      LEFT JOIN games g on gu.game_id = g.id
      WHERE g.join_code = ? AND gu.user_id = ?`,
    [joinCode, userId]
  );
}

function getLeaderboard(joinCode) {
  return all(
    `SELECT u.username, gu.score, gu.last_location as position FROM games_users gu
     LEFT JOIN users u on gu.user_id = u.id
     LEFT JOIN games g on gu.game_id = g.id
     WHERE g.join_code = ? ORDER BY score DESC`,
    joinCode
  );
}

function updateLeaderboard(user, prizeValue) {
  return run(`UPDATE games_users SET score = score + ? WHERE user_id = ?`, [
    prizeValue,
    user.sub,
  ]);
}

export { getUserLeaderboardInfo, getLeaderboard, updateLeaderboard };
