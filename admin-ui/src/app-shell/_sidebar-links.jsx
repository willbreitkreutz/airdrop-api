import { IconHome, IconPacman, IconUsers } from "@tabler/icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";

function MainLink({ icon, color, label, href }) {
  return (
    <a href={href}>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </a>
  );
}

const data = [
  {
    icon: <IconHome size="1rem" />,
    color: "blue",
    label: "Home",
    href: `/`,
  },
  {
    icon: <IconPacman size="1rem" />,
    color: "teal",
    label: "Games",
    href: `/games`,
  },
  {
    icon: <IconUsers size="1rem" />,
    color: "grape",
    label: "Users",
    href: `/users`,
  },
];

export default function SidebarLinks() {
  const links = data.map((link) => (
    <MainLink {...link} key={link.label} href={link.href} />
  ));
  return <div>{links}</div>;
}
