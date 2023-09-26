import { useForm } from "@mantine/form";
import { Box, Button, Group, TextInput } from "@mantine/core";
import { useAuth } from "../../utils/auth";

export default function LoginForm() {
  const { login, err } = useAuth();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });
  return (
    <Box maw={320} mx="auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(form.values);
        }}
      >
        <TextInput
          label="Username"
          placeholder="Username"
          {...form.getInputProps("username")}
        />
        <TextInput
          mt="md"
          label="Password"
          type="password"
          placeholder="Password"
          {...form.getInputProps("password")}
          error={err}
        />

        <Group position="center" mt="xl">
          <Button type="submit">Login / Create Account</Button>
        </Group>
      </form>
    </Box>
  );
}
