import { useAuth } from "../../utils/auth";
import { useRestApi } from "../../hooks/useRestApi";
import {
  Paper,
  Group,
  Grid,
  Stack,
  ScrollArea,
  ActionIcon,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconClockCancel,
  IconClock,
  IconClockPlus,
  IconMapPinPlus,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { doUpdateUrl } from "../../utils/nav-helper";
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

  const getIcon = (status) => {
    switch (status) {
      case "active":
        return (
          <ThemeIcon variant="light" color="green">
            <IconClock title="active game" />
          </ThemeIcon>
        );
      case "upcoming":
        return (
          <ThemeIcon variant="light" color="pink">
            <IconClockPlus title="upcoming game" />
          </ThemeIcon>
        );
      case "ended":
        return (
          <ThemeIcon variant="light" color="gray">
            {" "}
            <IconClockCancel title="ended game" />
          </ThemeIcon>
        );
      default:
        return null;
    }
  };

  return (
    <Paper shadow="xs" p="xs">
      <Grid justify="space-between" align="center">
        <Grid.Col span={6}>
          <Group>
            {getIcon(status)}
            <a href={`/games/${game.join_code}`}>
              <Text fz="md">{game.name}</Text>
            </a>
          </Group>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text fz="xs">
            <b>{`Start: `}</b>
            {format(new Date(game.start_time), "MM-dd-yyyy h:mm a")}
          </Text>
          <Text fz="xs">
            <b>{`End: `}</b>
            {format(new Date(game.end_time), "MM-dd-yyyy h:mm a")}
          </Text>
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
        <ActionIcon
          onClick={() => {
            doUpdateUrl("/games/new");
          }}
          variant="filled"
          color="primary"
        >
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
