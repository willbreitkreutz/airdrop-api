import { useAuth } from "../../utils/auth";
import { useRestApi } from "../../hooks/useRestApi";
import {
  Paper,
  Group,
  Grid,
  Stack,
  ScrollArea,
  ActionIcon,
} from "@mantine/core";
import {
  IconClockCancel,
  IconClock,
  IconClockPlus,
  IconMapPinPlus,
} from "@tabler/icons-react";
const apiRoot = __API_ROOT__;

function GameListItem({ game }) {
  const start = new Date(game.start_time);
  const end = new Date(game.end_time);
  const now = Date.now();

  let status = "active";
  if (now < start) {
    status = "upcoming";
  } else if (now > end) {
    status = "ended";
  }

  return (
    <Paper shadow="xs" p="xs">
      <Grid justify="space-around" align="center">
        <Grid.Col span={2}>
          {status === "active" ? <IconClock title="active game" /> : null}
          {status === "upcoming" ? (
            <IconClockPlus title="upcoming game" />
          ) : null}
          {status === "ended" ? <IconClockCancel title="ended game" /> : null}
        </Grid.Col>
        <Grid.Col span={2}>
          <p>{new Date(game.start_time).toString()}</p>
          <p>{new Date(game.end_time).toString()}</p>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col span={2}>
          <a href={`/games/${game.join_code}`}>
            <h3>{game.name}</h3>
          </a>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default function Games() {
  const { token } = useAuth();
  const { items, error, loading } = useRestApi({
    getUrl: `${apiRoot}/games`,
    token,
  });
  const mah = window.innerHeight - 180;
  return (
    <div>
      <Group position="apart">
        <h1>Games</h1>
        <ActionIcon variant="filled" color="primary">
          <IconMapPinPlus />
        </ActionIcon>
      </Group>
      <p>{loading ? "loading" : ""}</p>
      <ScrollArea.Autosize type="hover" mah={mah}>
        <Stack>
          {items &&
            items.map((item, i) => {
              return <GameListItem key={i} game={item} />;
            })}
        </Stack>
      </ScrollArea.Autosize>
    </div>
  );
}
