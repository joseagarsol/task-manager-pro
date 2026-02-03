import prisma from "@/lib/prisma";
import TasksPageClient from "@/features/tasks/components/TasksPageClient";
import { Task } from "@/features/tasks/types";
import { mapStatus } from "@/features/tasks/mappers";

export default async function Home() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      columnOrder: "asc",
    },
  });

  const formattedTasks: Task[] = tasks.map((task) => ({
    ...task,
    status: mapStatus(task.status),
  }));

  return <TasksPageClient initialTasks={formattedTasks} />;
}
