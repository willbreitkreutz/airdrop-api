import { get, run, all } from "../utils/db.js";
import { getGameIdFromJoinCode } from "./game-model.js";
import { getUserLeaderboardInfo } from "./leaderboard-model.js";

function addUserToGame(gameId, user) {
  return run(`INSERT INTO games_users (game_id, user_id) VALUES (?, ?)`, [
    gameId,
    user.id,
  ]);
}

async function createUser(username, hashed, avatar) {
  return get(
    `INSERT INTO users (username, password, roles, avatar) VALUES (?, ?, ?, ?) RETURNING id, username, roles, avatar`,
    [username, hashed, "PLAYER", avatar]
  );
}

function getUserByUsername(username) {
  return get(
    `SELECT id, username, password, roles, avatar FROM users WHERE username = ?`,
    [username]
  );
}

function getUserById(id) {
  return get(`SELECT id, username, roles, avatar FROM users WHERE id = ?`, [
    id,
  ]);
}

function getUserLastLocation(userId) {
  return get(
    `SELECT last_location as position FROM games_users WHERE user_id = ?`,
    userId
  );
}

function joinGame(joinCode, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const game = await getGameIdFromJoinCode(joinCode);
      const userLeaderboardInfo = await getUserLeaderboardInfo(
        joinCode,
        user.id
      );
      if (userLeaderboardInfo) {
        resolve();
      } else {
        await addUserToGame(game.id, user);
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
}

function listUsers() {
  return all(`SELECT id, username, roles, avatar FROM users`, []);
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

function deleteUser(id) {
  return run(`DELETE FROM users WHERE id = ?`, [id]);
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
  deleteUser,
};
