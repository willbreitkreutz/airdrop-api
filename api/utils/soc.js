import { WebSocketServer } from "ws";
import { authenticate, verifyWsToken } from "../controllers/auth-controller.js";
import { userMsgHandler } from "../socket-msg-handler/socket-msg-handler.js";
import { joinGame } from "../models/user-model.js";
import { deleteConnection } from "../models/connection-model.js";

function getChannelParam(req) {
  const url = new URL(req.url, "http://localhost");
  return url.searchParams.get("channel");
}

function onSocketError(err) {
  console.error(err);
}

const socketServer = new WebSocketServer({
  noServer: true,
  path: "/soc",
});

// Channels, keep track of channel subscribers here
const channels = {};

async function onConnection(ws, req, user) {
  const channel = getChannelParam(req);
  ws.on("error", console.error);
  ws.on("message", function onMessage(data) {
    userMsgHandler(channel, data, user, ws);
  });
  ws.on("close", function close() {
    deleteConnection(user.id, channel);
    channels[channel] = channels[channel].filter((w) => w !== ws);
    broadcast({
      type: "USER_DISCONNECTED",
      payload: `User ${user.username} disconnected`,
    });
    console.log(`User ${user.username} disconnected`);
  });
  if (channel) {
    ws.send(
      JSON.stringify({
        type: "WELCOME",
        payload: `Hello ${user.username}! You are connected to channel ${channel}`,
      })
    );
    if (!channels[channel]) {
      channels[channel] = [];
    }
    channels[channel].push(ws);
    await joinGame(channel, user);
    broadcastExceptSender(
      channel,
      JSON.stringify({
        type: "USER_JOINED",
        payload: `User ${user.username} connected`,
      }),
      ws
    );
    console.log(`User ${user.username} connected to channel ${channel}`);
  }
}

function onUpgrade(req, socket, head) {
  socket.on("error", onSocketError);
  const url = new URL(req.url, "http://localhost");
  const query = {
    channel: url.searchParams.get("channel"),
    wsToken: url.searchParams.get("wsToken"),
  };
  req.query = query;
  verifyWsToken(req, {}, function (err) {
    if (err) {
      onSocketError(err);
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    socket.removeListener("error", onSocketError);

    socketServer.handleUpgrade(req, socket, head, function done(ws) {
      socketServer.emit("connection", ws, req, req.user);
    });
  });
}

function connectSocketServer(server) {
  socketServer.on("connection", onConnection);
  server.on("upgrade", onUpgrade);
}

function broadcast(channel, message) {
  if (channels[channel]) {
    channels[channel].forEach((ws) => ws.send(message));
  }
}

function broadcastExceptSender(channel, message, sender) {
  if (channels[channel]) {
    channels[channel].forEach((ws) => {
      if (ws !== sender) {
        ws.send(message);
      }
    });
  }
}

function returnToSender(ws, message) {
  ws.send(message);
}

export {
  connectSocketServer,
  broadcast,
  broadcastExceptSender,
  returnToSender,
};
