import {
  ActionIcon,
  AppShell,
  Button,
  Navbar,
  Header,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoonStars, IconLogout } from "@tabler/icons-react";
import SidebarLinks from "./_sidebar-links";
import Logo from "./_logo";
import { useAuth } from "../utils/auth";

export default function CustomAppShell({ children }) {
  const { isLoggedIn, logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <AppShell
      padding="md"
      fixed={true}
      navbar={
        <>
          {isLoggedIn ? (
            <Navbar width={{ base: 300 }} p="xs">
              <Navbar.Section grow mt="xs">
                <SidebarLinks />
              </Navbar.Section>
            </Navbar>
          ) : null}
        </>
      }
      header={
        <Header height={60}>
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Logo colorScheme={colorScheme} />
            <Group>
              {isLoggedIn ? (
                <Button
                  onClick={logout}
                  size="xs"
                  leftIcon={<IconLogout size="1rem" />}
                  variant="default"
                >
                  Logout
                </Button>
              ) : null}
              <ActionIcon
                size="md"
                variant="default"
                onClick={() => toggleColorScheme()}
              >
                {colorScheme === "dark" ? (
                  <IconSun size="1rem" />
                ) : (
                  <IconMoonStars size="1rem" />
                )}
              </ActionIcon>
            </Group>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
