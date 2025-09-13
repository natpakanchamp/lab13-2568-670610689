import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Table,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import AddTaskModal from "../components/AddTaskModal";
import { useTaskStore } from "../store/TaskItemStore";
import { Badge } from "@mantine/core";

export default function TodoTablePage() {
  const { tasks, addTask, toggleTask, removeTask, setTasks } = useTaskStore();
  const [modalOpened, setModalOpened] = useState(false);
  const [isFirstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setFirstLoad(false);
      return;
    }
    const saveTasks = JSON.stringify(tasks);
    localStorage.setItem("task", saveTasks);
  }, [tasks]);

  useEffect(() => {
    const loadTasks = localStorage.getItem("task");
    if (loadTasks === null) {
      return;
    }
    setTasks(JSON.parse(loadTasks));
  }, []);

  const rows = tasks.map((task) => (
    <Table.Tr key={task.id}>
      <Table.Td w={250}>
        <Text fw={400} td={task.isDone ? "line-through" : "none"} size="md">
          {task.title}
        </Text>
      </Table.Td>
      <Table.Td w={250}>{task.description}</Table.Td>
      <Table.Td w={150}>
        <Checkbox
          checked={task.isDone}
          onChange={() => toggleTask(task.id)}
          label={task.isDone ? "Done" : "Pending"}
        />
      </Table.Td>
      <Table.Td >
        {task.dueDate ? dayjs(task.dueDate).format("ddd MMM DD YYYY") : "-"}
      </Table.Td>
      <Table.Td w={120}>
        {task.doneAt}
      </Table.Td>
      <Table.Td w={100}>
        <ActionIcon color="red" onClick={() => removeTask(task.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
      <Table.Td w={200}>
        {task.assignees.map((assignees) => (
          <Badge variant="light" color="blue">
            {assignees}
          </Badge>
        ))}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="lg">
      <Stack align="center">
        <Title order={2}>Todo List Table</Title>
        <Text size="sm" c="dimmed">
          All: {tasks.length} | Done: {tasks.filter((t) => t.isDone).length}
        </Text>
        <Button onClick={() => setModalOpened(true)}>Add Task</Button>

        <AddTaskModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          onAdd={addTask}
        />

        <Table striped highlightOnHover horizontalSpacing="xl">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Due Date</Table.Th>
              <Table.Th>Completed</Table.Th>
              <Table.Th>Actions</Table.Th>
              <Table.Th>Assignees</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Stack>
    </Container>
  );
}