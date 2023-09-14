import { get, run } from "../utils/db.js";

function createConnection(userId, channel, wsToken) {
  return run(
    `INSERT INTO connections (user_id, ws_token, channel, connected) VALUES (?, ?, ?, ?)`,
    [userId, wsToken, channel, false]
  );
}

function getConnection(wsToken) {
  return get(`SELECT * FROM connections WHERE ws_token = ?`, [wsToken]);
}

function updateConnection(wsToken, connected) {
  return run(`UPDATE connections SET connected = ? WHERE ws_token = ?`, [
    connected,
    wsToken,
  ]);
}

function deleteConnection(userId, channel) {
  return run(`DELETE FROM connections WHERE user_id = ? and channel = ?`, [
    userId,
    channel,
  ]);
}

export { createConnection, getConnection, updateConnection, deleteConnection };
