import {
  broadcast,
  broadcastExceptSender,
  returnToSender,
} from "../utils/soc.js";
import { setUserLastLocation } from "../models/user-model.js";

async function userMsgHandler(channel, data, user, ws) {
  console.log(`Received message ${data} from user ${user.username}`);
  let message = {};
  try {
    message = JSON.parse(data);
    switch (message.type) {
      case "BROADCAST":
        broadcast(channel, message.payload);
        break;
      case "LOCATION_UPDATE":
        if (!message?.payload?.position?.length) return;
        await setUserLastLocation(user.id, message.payload.position.join(","));
        // broadcastExceptSender(
        broadcast(
          channel,
          JSON.stringify({
            type: "USER_LOCATION_UPDATE",
            payload: {
              username: user.username,
              position: message.payload.position,
            },
          }),
          ws
        );
        break;
      default:
        console.error(`Unknown message type ${message.type}`);
    }
  } catch (err) {
    console.log(`error parsing JSON: ${err.message}`);
    returnToSender(
      ws,
      JSON.stringify({
        type: "ERROR",
        payload: "Invalid JSON",
      })
    );
  }
}

export { userMsgHandler };
