import { compare, hash, tokenForUser, verify } from "../utils/auth.js";
import * as userModel from "../models/user-model.js";

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
  const { username, password } = req.body;
  const existingUser = await userModel.getUserByUsername(username);
  if (existingUser) {
    const match = await compare(password, existingUser.password);
    if (match) {
      delete existingUser.password;
      req.user = existingUser;
      next();
    } else {
      res.status(401).send("Login failed");
    }
  } else {
    const hashed = await hash(password);
    const newUser = await userModel.createUser(username, hashed);
    delete newUser.password;
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

async function listUsers(req, res) {
  const users = await userModel.listUsers();
  res.status(200).json(users);
}

export {
  authenticate,
  selectOrCreateUser,
  issueToken,
  updateUserRoles,
  listUsers,
};
