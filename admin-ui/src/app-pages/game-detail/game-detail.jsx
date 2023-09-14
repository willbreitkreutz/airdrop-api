import GameForm from "../games/_game-form";
import { useRestApi } from "../../hooks/useRestApi";
import { useAuth } from "../../utils/auth";
import { doUpdateUrl } from "../../utils/nav-helper";
import { ActionIcon, Group } from "@mantine/core";
import { IconMap2 } from "@tabler/icons-react";

const apiRoot = __API_ROOT__;

export default function GameDetail({ routeParams }) {
  const { token } = useAuth();
  const { items, error, loading } = useRestApi({
    getUrl: `${apiRoot}/games/${routeParams.joinCode}/details`,
    token,
  });
  return (
    <div>
      <Group position="apart">
        <h1>Game Detail</h1>
        <ActionIcon
          onClick={() => {
            doUpdateUrl(`/games/${items[0].join_code}/watch`);
          }}
          variant="filled"
          color="blue"
        >
          <IconMap2 />
        </ActionIcon>
      </Group>
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
