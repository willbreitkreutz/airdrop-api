import { compare, hash, tokenForUser, verify } from "../utils/auth.js";
import * as userModel from "../models/user-model.js";
import * as connectionModel from "../models/connection-model.js";
import cacheAvatar from "../utils/cache-avatar.js";

function authenticate(role) {
  return function (req, _, next) {
    let token = req?.headers?.authorization;

    if (token) {
      token = token.replace("Bearer ", "");
      verify(token, (err, decoded) => {
        if (err) return next({ status: 401, error: err });

        if (role && !decoded.roles.includes(role)) {
          return next({
            status: 401,
            error: `You must have ${role} privileges to access this resource`,
          });
        }
        req.user = decoded;
        next();
      });
    } else {
      return next({
        status: 401,
        error: "No token provided, must be set on the Authorization Header",
      });
    }
  };
}

async function selectOrCreateUser(req, res, next) {
  const { username, password, avatar } = req.body;
  if (!username || !password)
    return res.status(400).send("Username and password required");
  const existingUser = await userModel.getUserByUsername(username);
  if (existingUser) {
    const match = await compare(password, existingUser.password);
    if (match) {
      delete existingUser.password;
      req.user = existingUser;
      next();
    } else {
      return res
        .status(401)
        .send(
          `Login failed, ${password} hashed did not match ${existingUser.password}`
        );
    }
  } else {
    if (!password || !username || !avatar) {
      return res.status(400).send("Username, password and avatar required");
    }
    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }
    const hashed = await hash(password);
    const newUser = await userModel.createUser(username, hashed, avatar);
    delete newUser.password;
    await cacheAvatar(username, avatar);
    req.user = newUser;
    next();
  }
}

async function updateUserRoles(req, res) {
  const { id, roles } = req.body;
  const updatedUser = await userModel.updateUserRoles(id, roles);
  res.status(200).json(updatedUser);
}

function issueToken(req, res) {
  const { user } = req;
  tokenForUser(user, (err, token) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ token });
  });
}

async function issueWsToken(req, res) {
  const { user } = req;
  const { joinCode } = req.query;
  const str = `${user.sub}-${joinCode}`;
  console.log(str);
  const wsToken = await hash(str);
  await connectionModel.createConnection(user.sub, joinCode, wsToken);
  res.status(200).json({ wsToken, str });
}

async function verifyWsToken(req, _, next) {
  const { channel, wsToken } = req.query;
  const connection = await connectionModel.getConnection(wsToken);
  const verifyString = `${connection?.user_id}-${channel}`;
  const match = await compare(verifyString, wsToken);
  if (match) {
    if (connection && !connection.connected) {
      await connectionModel.updateConnection(connection.id, true);
      req.user = await userModel.getUserById(connection.user_id);
      next();
    } else {
      next({ status: 406, verified: false, message: "Already connected" });
    }
  } else {
    next({ status: 401, verified: false, message: "Bad Request" });
  }
}

async function listUsers(req, res) {
  const users = await userModel.listUsers();
  res.status(200).json(users);
}

async function deleteUser(req, res) {
  const { id } = req.body;
  await userModel.deleteUser(id);
  res.status(200).json({ message: "User deleted" });
}

export {
  authenticate,
  issueToken,
  issueWsToken,
  listUsers,
  selectOrCreateUser,
  updateUserRoles,
  verifyWsToken,
  deleteUser,
};
