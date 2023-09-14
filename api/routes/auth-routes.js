import express from "express";
const router = express.Router();
import {
  authenticate,
  issueToken,
  issueWsToken,
  selectOrCreateUser,
  updateUserRoles,
  listUsers,
} from "../controllers/auth-controller.js";

router.get("/users", authenticate("ADMIN"), listUsers);
router.post("/login", selectOrCreateUser, issueToken);
router.get("/ws-token", authenticate("PLAYER"), issueWsToken);
router.get("/verify-token", authenticate("PLAYER"), (req, res) => {
  res.json(req.user);
});
router.put("/update", authenticate("ADMIN"), updateUserRoles);

export default router;
