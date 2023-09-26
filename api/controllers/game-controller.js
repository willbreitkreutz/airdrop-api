import { broadcast } from "../utils/soc.js";
import * as gameModel from "../models/game-model.js";
import * as leaderboardModel from "../models/leaderboard-model.js";
import * as prizeModel from "../models/prize-model.js";
import * as userModel from "../models/user-model.js";
import { circle } from "@turf/turf";

async function claimPrize(req, res) {
  const user = req.user;
  const { joinCode, prizeId } = req.params;

  const prize = await prizeModel.getPrize(prizeId);
  if (!prize) {
    res.status(404).send("Prize not found");
  } else if (prize.claimed_by) {
    res.status(400).send("Prize already claimed");
  } else {
    const now = new Date();
    const start = new Date(prize.start_time);
    if (now - start > prize.duration) {
      res.status(400).send("Prize is no longer valid");
    } else {
      const pctTimeElapsed = 100 * ((now - start) / prize.duration);
      const radius = 0.1 * Math.pow(pctTimeElapsed, 2);
      const prizePolygon = circle([prize.x, prize.y], radius, {
        steps: 10,
        units: "meters",
      });
      const prizeValue = Math.floor((radius / 1000) * prize.max_value);

      const lastLocationRow = await userModel.getUserLastLocation(user.id);
      if (lastLocationRow) {
        const userPoint = {
          type: "Point",
          coordinates: JSON.parse(lastLocationRow.last_location),
        };
        if (turf.booleanPointInPolygon(userPoint, prizePolygon)) {
          await prizeModel.updatePrize(user, prizeId, prizeValue);
          await leaderboardModel.updateLeaderboard(user, prizeValue);
          res.status(200).send("Prize claimed");
          broadcast(joinCode, JSON.stringify({ type: "PRIZE_CLAIMED" }));
        } else {
          res.status(400).send("User is not in the right place");
        }
      } else {
        res.status(400).send("User location not found");
      }
    }
  }
}

async function createGame(req, res) {
  const {
    name,
    startTime,
    endTime,
    prizeCount,
    prizeMaxValue,
    prizeDuration,
    geom,
  } = req.body;
  const game = gameModel.createGame({
    name,
    startTime,
    endTime,
    prizeCount,
    prizeMaxValue,
    prizeDuration,
    geom,
  });
  res.json(game);
}

async function updateGame(req, res) {
  const {
    id,
    name,
    startTime,
    endTime,
    prizeCount,
    prizeMaxValue,
    prizeDuration,
    geom,
  } = req.body;
  const game = gameModel.updateGame({
    id,
    name,
    startTime,
    endTime,
    prizeCount,
    prizeMaxValue,
    prizeDuration,
    geom,
  });
  res.json(game);
}

async function getLeaderboard(req, res) {
  const { joinCode } = req.params;
  const leaderboard = await leaderboardModel.getLeaderboard(joinCode);
  res.json(leaderboard);
}

async function getActivePrizes(req, res) {
  const { joinCode } = req.params;
  const prizes = await prizeModel.getActivePrizes(joinCode);
  res.json(prizes);
}

async function getGameDetails(req, res) {
  const { joinCode } = req.params;
  const game = await gameModel.getGameDetails(joinCode);
  res.json(game);
}

async function listGames(req, res) {
  const games = await gameModel.listGames();
  res.json(games);
}

export {
  claimPrize,
  createGame,
  getGameDetails,
  getLeaderboard,
  getActivePrizes,
  listGames,
  updateGame,
};
