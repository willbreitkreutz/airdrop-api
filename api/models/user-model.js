import { get, run, all } from "../utils/db.js";
import { getGameIdFromJoinCode } from "./game-model.js";
import { getUserLeaderboardInfo } from "./leaderboard-model.js";

function addUserToGame(gameId, user) {
  return run(`INSERT INTO games_users (game_id, user_id) VALUES (?, ?)`, [
    gameId,
    user.sub,
  ]);
}

async function createUser(username, hashed) {
  return get(
    `INSERT INTO users (username, password, roles) VALUES (?, ?, ?) RETURNING id, username, roles`,
    [username, hashed, "PLAYER"]
  );
}

function getUserByUsername(username) {
  return get(
    `SELECT id, username, password, roles FROM users WHERE username = ?`,
    [username]
  );
}

function getUserById(id) {
  return get(`SELECT id, username, roles FROM users WHERE id = ?`, [id]);
}

function getUserLastLocation(userId) {
  return get(`SELECT last_location FROM games_users WHERE user_id = ?`, userId);
}

function joinGame(joinCode, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const gameId = await getGameIdFromJoinCode(joinCode);
      const userLeaderboardInfo = await getUserLeaderboardInfo(
        joinCode,
        user.sub
      );
      if (userLeaderboardInfo) {
        resolve();
      } else {
        await addUserToGame(gameId, user);
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}

function listUsers() {
  return all(`SELECT id, username, roles FROM users`, []);
}

function setUserLastLocation(userId, location) {
  return run(`UPDATE games_users SET last_location = ? WHERE user_id = ?`, [
    location,
    userId,
  ]);
}

function updateUserRoles(id, roles) {
  return run(
    `UPDATE users SET roles = ? WHERE id = ? returning id, username, roles`,
    [roles, id]
  );
}

export {
  addUserToGame,
  createUser,
  getUserById,
  getUserByUsername,
  getUserLastLocation,
  joinGame,
  listUsers,
  setUserLastLocation,
  updateUserRoles,
};
