import sqlite3 from "sqlite3";
import { hashSync } from "./auth.js";

const staticPath = process.env.STATIC_PATH || "";
const db = new sqlite3.Database(`${staticPath}database/airdrop-db.db`);

const adminUser = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: hashSync(process.env.ADMIN_PASSWORD || "password"),
  roles: "PLAYER,ADMIN",
};

// if the database is new scaffold out our connections table to track websocket connections
db.serialize(() => {
  // users table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT NOT NULL UNIQUE, 
      password TEXT NOT NULL, 
      avatar TEXT,
      roles TEXT, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
  );
  console.log("trying to create admin user");
  db.run(
    `INSERT OR IGNORE INTO users (username, password, roles) VALUES ('${adminUser.username}', '${adminUser.password}', '${adminUser.roles}')`
  );
  // connections table
  db.run(
    `CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      ws_token TEXT,
      channel TEXT,
      connected BOOLEAN,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
  );
  // games table
  db.run(
    `CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      geometry TEXT,
      bbox TEXT,
      join_code TEXT, 
      name TEXT, 
      start_time DATETIME, 
      end_time DATETIME, 
      prize_count INTEGER,
      prize_max_value INTEGER,
      prize_duration INTEGER, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
  );
  // games_users table
  db.run(
    `CREATE TABLE IF NOT EXISTS games_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      game_id TEXT, 
      user_id TEXT, 
      score INTEGER DEFAULT 0,
      last_location TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
  );
  // prizes table
  db.run(
    `CREATE TABLE IF NOT EXISTS prizes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT,
      start_time DATETIME,
      duration INTEGER,
      max_value INTEGER,
      x FLOAT,
      y FLOAT,
      claimed_by INTEGER,
      claimed_at DATETIME,
      claimed_value INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
  );
  console.log("Scaffold complete");
});

function get(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function all(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function exec(sql, params) {
  return new Promise((resolve, reject) => {
    db.exec(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function run(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

export { get, all, exec, run };
export default db;
