import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connect } from "./utils/soc.js";
import authRoutes from "./routes/auth-routes.js";
import gameRoutes from "./routes/game-routes.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const env = process.env;

app.use("/auth", authRoutes);
app.use("/games", gameRoutes);

function startup() {
  const server = app.listen(env.HTTP_PORT);

  // gracefully shutdown
  process.on("SIGTERM", () => {
    debug("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      debug("HTTP server closed");
    });
  });

  connect(server);

  console.log(`Airdrop-API listening on ${env.HTTP_PORT}`);
}

startup();
