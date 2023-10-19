import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET;

async function hash(data) {
  const hash = await bcrypt.hash(data, 12);
  return hash;
}

function hashSync(data) {
  return bcrypt.hashSync(data, 12);
}

async function compare(data, hash) {
  return await bcrypt.compare(data, hash);
}

function _sign(payload, cb) {
  jwt.sign(payload, AUTH_SECRET, { algorithm: "HS512", expiresIn: "1d" }, cb);
}

function verify(token, cb) {
  jwt.verify(token, AUTH_SECRET, { algorithm: "HS512" }, cb);
}

function tokenForUser(user, cb) {
  return _sign(
    { sub: user.id, username: user.username, roles: user.roles.split(",") },
    cb
  );
}

export { hash, hashSync, compare, verify, tokenForUser };
