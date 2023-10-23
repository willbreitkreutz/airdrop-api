import { broadcast } from "../utils/soc.js";
import * as gameModel from "../models/game-model.js";
import * as leaderboardModel from "../models/leaderboard-model.js";
import * as prizeModel from "../models/prize-model.js";
import * as userModel from "../models/user-model.js";
import { circle, booleanWithin } from "@turf/turf";

async function claimPrize(req, res) {
  const user = req.user;
  const { joinCode, prizeId } = req.params;

  const prize = await prizeModel.getPrize(prizeId);
  if (!prize) {
    res.status(404).send("Prize not found");
  } else if (prize.claimed_by) {
    res.status(400).send("Prize already claimed");
  } else {
    const now = new Date().getTime();
    const start = new Date(prize.start_time).getTime();
    const elapsed = now - start;
    const duration = prize.duration * 1000;
    if (now - start > duration) {
      res.status(400).send("Prize is no longer valid");
    } else {
      // calculate percentage of time elapsed
      const pctT = Math.ceil((elapsed / duration) * 100);

      // calculate new radius based on time elapsed
      const radius = 1 + 0.1 * Math.pow(pctT, 2);

      // calculate new value based on time elapsed
      const prizeValue = Math.ceil(
        prize.max_value * ((100 - 0.01 * Math.pow(pctT, 2)) / 100)
      );

      const prizePolygon = circle([prize.x, prize.y], radius, {
        units: "meters",
      });

      const lastLocationRow = await userModel.getUserLastLocation(user.sub);
      if (lastLocationRow) {
        const userPoint = {
          type: "Point",
          coordinates: lastLocationRow.position.split(",").map(Number),
        };
        if (booleanWithin(userPoint, prizePolygon)) {
          await prizeModel.updatePrize(user, prizeId, prizeValue);
          await leaderboardModel.updateLeaderboard(user, prizeValue);
          const updatedUserLeaderboardEntry =
            await leaderboardModel.getUserLeaderboardInfo(joinCode, user.sub);
          res.status(200).send("Prize claimed");
          broadcast(
            joinCode,
            JSON.stringify({
              type: "PRIZE_CLAIMED",
              payload: {
                prizeId: prizeId,
                username: updatedUserLeaderboardEntry.username,
                score: updatedUserLeaderboardEntry.score,
                position: updatedUserLeaderboardEntry.position,
              },
            })
          );
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
