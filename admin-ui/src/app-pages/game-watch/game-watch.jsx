import { useRestApi } from "../../hooks/useRestApi";
import { useAuth } from "../../utils/auth";
import { doUpdateUrl } from "../../utils/nav-helper";
import { ActionIcon, Group } from "@mantine/core";
import { IconPacman } from "@tabler/icons-react";
import GameMap from "./_game-map";

// eslint-disable-next-line no-undef
const apiRoot = __API_ROOT__;

export default function GameWatch({ routeParams }) {
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
            doUpdateUrl(`/games/${items[0].join_code}`);
          }}
          variant="filled"
          color="green"
        >
          <IconPacman />
        </ActionIcon>
      </Group>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : items && items[0] ? (
        <GameMap game={items[0]} />
      ) : null}
    </div>
  );
}
