/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useAuth } from "../utils/auth";

const apiRoot = __API_ROOT__;

export function useGameConnection(game, onPrize) {
  const { token } = useAuth();
  const [wsToken, setWsToken] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (wsToken) return;
    fetch(`${apiRoot}/auth/ws-token?joinCode=${game.join_code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setWsToken(data?.wsToken);
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!wsToken) return;
    if (socket) return;
    const s = new WebSocket(
      `${apiRoot.replace("http", "ws")}/soc?channel=${
        game.join_code
      }&wsToken=${wsToken}`
    );
    s.addEventListener("open", (_) => {
      console.log("Connected to server");
    });
    s.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      try {
        const dataObj = JSON.parse(event.data);
        const { type, payload } = dataObj;
        switch (type) {
          case "PRIZE_POINT":
            if (onPrize && typeof onPrize === "function") onPrize(payload);
            break;
          default:
            console.log("Unknown message type: ", event.data.type);
        }
      } catch (e) {
        console.error(e);
      }
    });
    setSocket(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsToken]);

  useEffect(() => {
    if (!socket) return;
    return () => {
      console.log("Disconnecting from socket");
      socket.close();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return { socket };
}
