import { useAuth } from "../../utils/auth";
import { useRestApi } from "../../hooks/useRestApi";
import {
  Avatar,
  Stack,
  Loader,
  Switch,
  Paper,
  Grid,
  ScrollArea,
} from "@mantine/core";
// eslint-disable-next-line no-undef
const apiRoot = __API_ROOT__;

function UserCard({ user, saveUser }) {
  let isAdmin = user.roles.includes("ADMIN");
  const handleChange = (e) => {
    isAdmin = e.target.checked;
    const roles = user.roles.split(",");
    if (isAdmin) {
      roles.push("ADMIN");
    } else {
      roles.splice(roles.indexOf("ADMIN"), 1);
    }
    saveUser({ ...user, ...{ roles: roles.join(",") } });
  };

  return (
    <Paper shadow="xs" p="xs">
      <Grid justify="space-around" align="center">
        <Grid.Col span={2}>
          <Avatar radius="xl" src={`${apiRoot}/avatars/${user.username}.png`} />
        </Grid.Col>
        <Grid.Col span={4}>
          <h3>{user.username}</h3>
        </Grid.Col>
        <Grid.Col span={6}>
          <Switch
            label="Admin"
            checked={isAdmin}
            onChange={handleChange}
            color="pink"
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default function Users() {
  const { token } = useAuth();
  const { items, save, loading } = useRestApi({
    getUrl: `${apiRoot}/auth/users`,
    putUrl: `${apiRoot}/auth/update`,
    token,
    staleAfter: 1 * 60 * 1000,
  });
  const mah = window.innerHeight - 180;
  return (
    <div>
      <h1>Users</h1>
      {loading ? <Loader variant="bars" /> : null}
      <ScrollArea.Autosize type="hover" mah={mah}>
        <Stack>
          {items &&
            items.map((item, i) => {
              return <UserCard key={i} user={item} saveUser={save} />;
            })}
        </Stack>
      </ScrollArea.Autosize>
    </div>
  );
}
