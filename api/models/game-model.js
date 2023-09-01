import db, { get, run } from "../utils/db.js";
import { bbox, booleanPointInPolygon, randomPoint } from "@turf/turf";
import { broadcast } from "../utils/soc.js";

class Game {
  constructor(props) {
    this.id = props.id || null;
    this.joinCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.name = props.name;
    this.geom = props.geom;
    this.bbox = bbox(props.geom);
    this.startTime = new Date(props.startTime);
    this.endTime = new Date(props.endTime);
    this.prizeCount = props.prizeCount || 100;
    this.dropInterval = (this.endTime - this.startTime) / this.prizeCount;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.id) {
          const g = await get(`SELECT * FROM games WHERE id = ?`, [this.id]);
          this.joinCode = row.join_code;
          this.name = row.name;
          this.geom = row.geometry;
          this.bbox = row.bbox;
          this.startTime = row.start_time;
          this.endTime = row.end_time;
          this.prizeCount = row.prize_count;
          this.prizeMaxValue = row.prize_max_value;
          this.prizeDuration = row.prize_duration;
        } else {
          const self = this;
          const newId = await run(
            `INSERT INTO games (join_code, name, geometry, bbox, start_time, end_time, prize_count, prize_max_value, prize_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              this.joinCode,
              this.name,
              this.geom,
              this.bbox,
              this.startTime,
              this.endTime,
              this.prizeCount,
              this.prizeMaxValue,
              this.prizeDuration,
            ]
          );
          self.id = newId;
        }
        this.setStartTimer();
        resolve(this);
      } catch (err) {
        reject(err);
      }
    });
  }

  setStartTimer() {
    setTimeout(this.start, Math.max(this.startTime - Date.now(), 0), this);
  }

  generatePrizePoint() {
    let points;
    do {
      points = randomPoint(1, { bbox: this.bbox });
    } while (!booleanPointInPolygon(points.features[0], this.geom));
    return points.features[0];
  }

  start(self) {
    self.dropper = setInterval(() => {
      const point = self.generatePrizePoint();
      broadcast(
        self.joinCode,
        JSON.stringify({ type: "PRIZE_POINT", payload: point })
      );
      if (Date.now() > self.endTime) self.end();
    }, self.dropInterval);
    broadcast(self.joinCode, JSON.stringify({ type: "GAME_START" }));
  }

  end() {
    clearInterval(this.dropper);
    broadcast(this.joinCode, JSON.stringify({ type: "GAME_OVER" }));
  }
}

function newGame(props) {
  const g = new Game(props);
  return g.init();
}

function getGameIdFromJoinCode(joinCode) {
  return get(`SELECT id FROM games WHERE join_code = ?`, joinCode);
}

export { getGameIdFromJoinCode, newGame };
