import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET;

async function hash(password) {
  const hash = await bcrypt.hash(password, 12);
  return hash;
}

async function compare(password, hash) {
  return await bcrypt.compare(password, hash);
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

export { hash, compare, verify, tokenForUser };
