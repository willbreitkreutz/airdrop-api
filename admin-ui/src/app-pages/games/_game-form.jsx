import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Group,
  NumberInput,
  TextInput,
  JsonInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

export default function GameForm({ game = {}, onSave, onCancel }) {
  console.log(game);
  const form = useForm({
    initialValues: {
      id: game.id || "",
      joinCode: game.join_code || "",
      name: game.name || "",
      geom: game.geometry || "",
      startTime: game.start_time ? new Date(game.start_time) : new Date(),
      endTime: game.end_time ? new Date(game.end_time) : new Date(),
      prizeCount: game.prize_count || 100,
      prizeMaxValue: game.prize_max_value || 100,
      prizeDuration: game.prize_duration || 100,
    },
    transformValues: (values) => ({
      ...values,
      ...{
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        geom: JSON.parse(values.geom),
      },
    }),
  });
  return (
    <Box maw={320} mx="auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form.getTransformedValues());
        }}
      >
        <TextInput
          label="Game ID"
          placeholder="Game ID"
          disabled={true}
          {...form.getInputProps("id")}
        />
        <TextInput
          mt="md"
          label="Join Code"
          placeholder="Join Code"
          disabled={true}
          {...form.getInputProps("joinCode")}
        />
        <TextInput
          mt="md"
          label="Name"
          placeholder="Name"
          disabled={false}
          {...form.getInputProps("name")}
        />
        <JsonInput
          mt="md"
          label="Geom"
          placeholder="Geom"
          validationError="Invalid JSON"
          formatOnBlur
          disabled={false}
          {...form.getInputProps("geom")}
        />
        <DateTimePicker
          mt="md"
          label="Start Time"
          placeholder="Start Time"
          defaultDate={new Date()}
          disabled={false}
          {...form.getInputProps("startTime")}
        />
        <DateTimePicker
          mt="md"
          label="End Time"
          placeholder="End Time"
          defaultDate={new Date()}
          disabled={false}
          {...form.getInputProps("endTime")}
        />
        <NumberInput
          mt="md"
          label="Prize Count"
          placeholder="Prize Count"
          disabled={false}
          {...form.getInputProps("prizeCount")}
        />
        <NumberInput
          mt="md"
          label="Prize Max Value"
          description="Value starts here and goes to 0 by the end of the prize duration"
          placeholder="Prize Max Value"
          disabled={false}
          {...form.getInputProps("prizeMaxValue")}
        />
        <NumberInput
          mt="md"
          label="Prize Duration"
          description="Duration in seconds"
          placeholder="Prize Duration"
          disabled={false}
          {...form.getInputProps("prizeDuration")}
        />
        <Group position="center" mt="xl">
          <Button type="submit">Save</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Group>
      </form>
    </Box>
  );
}
