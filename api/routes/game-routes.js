import express from "express";
const router = express.Router();
import { authenticate } from "../controllers/auth-controller.js";
import {
  claimPrize,
  createGame,
  getGameDetails,
  getLeaderboard,
  listPrizes,
  listGames,
} from "../controllers/game-controller.js";

router.get("/", authenticate("ADMIN"), listGames);
router.post("/", authenticate("ADMIN"), createGame);
router.get("/:joinCode/details", authenticate("PLAYER"), getGameDetails);
router.get("/:joinCode/leaderboard", authenticate("PLAYER"), getLeaderboard);
router.get("/:joinCode/prizes", authenticate("PLAYER"), listPrizes);
router.post(
  "/:joinCode/prize/:prizeId/claim",
  authenticate("PLAYER"),
  claimPrize
);

export default router;
