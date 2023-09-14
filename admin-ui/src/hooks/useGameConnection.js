import { useState, useEffect } from "react";
import { useAuth } from "../utils/auth";

const apiRoot = __API_ROOT__;

export function useGameConnection(game) {
  const { token } = useAuth();
  const [wsToken, setWsToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [boundary, setBoundary] = useState(null);
  const [players, setPlayers] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

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
  }, []);

  useEffect(() => {
    if (!wsToken) return;
    if (socket) return;
    const s = new WebSocket(
      `ws://localhost:3000/soc?channel=${game.join_code}&wsToken=${wsToken}`
    );
    s.addEventListener("open", (_) => {
      console.log("Connected to server");
      s.send(JSON.stringify({ type: "BROADCAST", payload: "Hello Server!" }));
    });
    s.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    });
    setSocket(s);
  }, [wsToken]);

  return { boundary, players, prizes, leaderboard };
}
