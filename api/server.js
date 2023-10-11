import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectSocketServer } from "./utils/soc.js";
import { startActiveGames } from "./utils/gametime.js";
import authRoutes from "./routes/auth-routes.js";
import gameRoutes from "./routes/game-routes.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const env = process.env;

app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/games", gameRoutes);
app.use("/avatars", express.static("api/avatars"));

app.use((err, _, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ status, message });
});

function startup() {
  const server = app.listen(env.HTTP_PORT);

  // gracefully shutdown
  process.on("SIGTERM", () => {
    debug("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      debug("HTTP server closed");
    });
  });

  connectSocketServer(server);
  startActiveGames();

  console.log(`Airdrop-API listening on ${env.HTTP_PORT}`);
}

startup();
