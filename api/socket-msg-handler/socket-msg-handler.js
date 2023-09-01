import { broadcast, broadcastExceptSender } from "../utils/soc.js";
import { setUserLastLocation } from "../models/user-model.js";

async function userMsgHandler(channel, data, user, ws) {
  console.log(`Received message ${data} from user ${user.username}`);
  const message = JSON.parse(data);
  switch (message.type) {
    case "BROADCAST":
      broadcast(channel, message.payload);
      break;
    case "LOCATION_UPDATE":
      await setUserLastLocation(
        user.sub,
        message?.payload?.position?.join(",")
      );
      broadcastExceptSender(
        channel,
        JSON.stringify({ type: "USER_LOCATION_UPDATE", payload: message }),
        ws
      );
      break;
    default:
      console.error(`Unknown message type ${message.type}`);
  }
}

export { userMsgHandler };
