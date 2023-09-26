import { getActiveGames } from "../models/game-model.js";
import { createPrize, getPrizeGeoJSON } from "../models/prize-model.js";
import { bbox, booleanPointInPolygon, randomPoint } from "@turf/turf";
import { broadcast } from "./soc.js";

class Game {
  constructor(props) {
    this.id = props.id;
    this.joinCode = props.join_code;
    this.name = props.name;
    this.geometry = JSON.parse(props.geometry);
    this.bbox = bbox(this.geometry);
    this.startTime = props.start_time;
    this.endTime = props.end_time;
    this.prizeCount = props.prize_count;
    this.prizeMaxValue = props.prize_max_value;
    this.prizeDuration = props.prize_duration;
    this.dropInterval = (this.endTime - this.startTime) / this.prizeCount;
  }

  generatePrizePoint() {
    let candidate_points;
    do {
      candidate_points = randomPoint(1, { bbox: this.bbox });
    } while (
      !booleanPointInPolygon(candidate_points.features[0], this.geometry)
    );
    return candidate_points.features[0];
  }

  start(self) {
    self.dropper = setInterval(async () => {
      const point = self.generatePrizePoint();
      const prizeId = await createPrize({
        gameId: self.id,
        startTime: Date.now(),
        duration: self.prizeDuration,
        maxValue: self.prizeMaxValue,
        x: point.geometry.coordinates[0],
        y: point.geometry.coordinates[1],
      });
      const prizePoint = await getPrizeGeoJSON(prizeId);
      broadcast(
        self.joinCode,
        JSON.stringify({ type: "PRIZE_POINT", payload: prizePoint })
      );
      if (Date.now() > self.endTime) self.end();
    }, self.dropInterval);
    broadcast(self.joinCode, JSON.stringify({ type: "GAME_START" }));
  }

  end() {
    clearInterval(this.dropper);
    broadcast(this.joinCode, JSON.stringify({ type: "GAME_OVER" }));
    this.cleanup();
  }
}

// store all active games here by join_code
// an active game is the interval running the point dropper
const activeGames = {};

// on startup, new game, or edits to a game,
// get list of active games and start them up
async function startActiveGames() {
  const games = await getActiveGames();
  games &&
    games.forEach((g) => {
      if (!activeGames.hasOwnProperty(g.join_code)) {
        console.log("starting game", g.join_code);
        const game = new Game({
          ...g,
          cleanup: () => delete activeGames[g.join_code],
        });
        activeGames[g.join_code] = game;
        game.start(game);
      }
    });
}

// remove any games that may have been inactivated
async function removeInactiveGames() {
  const games = await getActiveGames();
  Object.keys(activeGames).forEach((join_code) => {
    if (!games.find((g) => g.join_code === join_code)) {
      activeGames[join_code].end();
    }
  });
}

// every 5 seconds, check for active and inactive games
setInterval(() => {
  startActiveGames();
  removeInactiveGames();
}, 5000);

export { activeGames, startActiveGames, removeInactiveGames };
