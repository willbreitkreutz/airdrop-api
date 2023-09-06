import GameForm from "../games/_game-form";
import { useRestApi } from "../../hooks/useRestApi";
import { useAuth } from "../../utils/auth";
import { doUpdateUrl } from "../../utils/nav-helper";

const apiRoot = __API_ROOT__;

export default function NewGame({}) {
  const { token } = useAuth();
  const { save } = useRestApi({
    postUrl: `${apiRoot}/games`,
    token,
  });
  return (
    <div>
      <h1>New Game</h1>
      <GameForm
        onSave={(item) => {
          save(item, (savedItem) => {
            doUpdateUrl(`/games/${savedItem.joinCode}`);
          });
        }}
        onCancel={() => {
          window.history.back();
        }}
      />
    </div>
  );
}
