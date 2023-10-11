import express from "express";
const router = express.Router();
import { authenticate } from "../controllers/auth-controller.js";
import {
  claimPrize,
  createGame,
  getGameDetails,
  getLeaderboard,
  getActivePrizes,
  listGames,
  updateGame,
} from "../controllers/game-controller.js";

router.get("/", authenticate("PLAYER"), listGames);
router.post("/", authenticate("ADMIN"), createGame);
router.put("/:joinCode", authenticate("ADMIN"), updateGame);
router.get("/:joinCode/details", authenticate("PLAYER"), getGameDetails);
router.get("/:joinCode/leaderboard", authenticate("PLAYER"), getLeaderboard);
router.get("/:joinCode/prizes", authenticate("PLAYER"), getActivePrizes);
router.post(
  "/:joinCode/prize/:prizeId/claim",
  authenticate("PLAYER"),
  claimPrize
);

export default router;
