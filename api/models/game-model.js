import { get, run, all } from "../utils/db.js";
import { bbox } from "@turf/turf";

async function createGame(props) {
  const start = new Date(props.startTime);
  const end = new Date(props.endTime);
  const newId = await run(
    `INSERT INTO games (join_code, name, geometry, bbox, start_time, end_time, prize_count, prize_max_value, prize_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) returning id`,
    [
      Math.random().toString(36).substring(2, 6).toUpperCase(),
      props.name,
      JSON.stringify(props.geom),
      JSON.stringify(bbox(props.geom)),
      start,
      end,
      props.prizeCount || 100,
      props.prizeMaxValue || 100,
      props.prizeDuration,
    ]
  );
  return getGameById(newId);
}

async function updateGame(props) {
  const start = new Date(props.startTime);
  const end = new Date(props.endTime);
  await run(
    `UPDATE games set name = ?, geometry = ?, bbox = ?, start_time = ?, end_time = ?, prize_count = ?, prize_max_value = ?, prize_duration = ? where id = ?`,
    [
      props.name,
      JSON.stringify(props.geom),
      JSON.stringify(bbox(props.geom)),
      start,
      end,
      props.prizeCount || 100,
      props.prizeMaxValue || 100,
      props.prizeDuration,
      props.id,
    ]
  );
  return getGameById(props.id);
}

function getGameById(id) {
  return get(`SELECT * FROM games WHERE id = ?`, id);
}

function getGameDetails(joinCode) {
  return get(`SELECT * FROM games WHERE join_code = ?`, joinCode);
}

function listGames() {
  return all(`SELECT * FROM games`);
}

function getGameIdFromJoinCode(joinCode) {
  return get(`SELECT id FROM games WHERE join_code = ?`, joinCode);
}

function getActiveGames() {
  const now = new Date();
  return all(`SELECT * from games where start_time < ? and end_time > ?`, [
    now,
    now,
  ]);
}

export {
  createGame,
  updateGame,
  getActiveGames,
  getGameDetails,
  getGameIdFromJoinCode,
  listGames,
};
