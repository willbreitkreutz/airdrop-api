import express from "express";
const router = express.Router();
import { authenticate } from "../controllers/auth-controller.js";
import {
  claimPrize,
  createGame,
  getLeaderboard,
  listPrizes,
} from "../controllers/game-controller.js";

router.post("/new", authenticate("ADMIN"), createGame);
router.get("/:joinCode/leaderboard", authenticate("PLAYER"), getLeaderboard);
router.get("/:joinCode/prizes", authenticate("PLAYER"), listPrizes);
router.post(
  "/:joinCode/prize/:prizeId/claim",
  authenticate("PLAYER"),
  claimPrize
);

export default router;
