import prisma from "@/lib/prisma";
import TasksPageClient from "@/features/tasks/components/TasksPageClient";
import { Task } from "@/features/tasks/types";

export default async function Home() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      columnOrder: "asc",
    },
  });

  const formattedTasks: Task[] = tasks.map((task) => ({
    ...task,
    status:
      task.status === "InProgress"
        ? "In Progress"
        : (task.status as Task["status"]),
  }));

  return <TasksPageClient initialTasks={formattedTasks} />;
}
