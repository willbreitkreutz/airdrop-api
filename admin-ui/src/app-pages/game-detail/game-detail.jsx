import GameForm from "../games/_game-form";
import { useRestApi } from "../../hooks/useRestApi";
import { useAuth } from "../../utils/auth";

const apiRoot = __API_ROOT__;

export default function GameDetail({ routeParams }) {
  const { token } = useAuth();
  const { items, error, loading } = useRestApi({
    getUrl: `${apiRoot}/games/${routeParams.joinCode}/details`,
    token,
  });
  return (
    <div>
      <h1>Game Detail</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : items && items[0] ? (
        <GameForm game={items[0]} />
      ) : null}
    </div>
  );
}
