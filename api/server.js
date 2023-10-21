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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/health", (_, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use("/auth", authRoutes);
app.use("/games", gameRoutes);

// because we are running dev mode inside a sub folder
// we need to prepend that folders name to the static path
const staticPath = env.STATIC_PATH || "";
app.use("/avatars", express.static(`${staticPath}avatars`));
app.use("/admin", express.static(`${staticPath}dist`, { fallthrough: true }));
app.use((_, res, next) => {
  res.sendFile(`${staticPath}dist/index.html`, { root: "." }, (err) => {
    if (err) next(err);
  });
});

// global error handler
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

  console.log(`Starting up in ${env.NODE_ENV} mode`);
  console.log(`Airdrop-API listening on ${env.HTTP_PORT}`);
}

startup();
