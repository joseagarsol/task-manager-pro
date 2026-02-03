import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TaskDetail from "@/features/tasks/components/TaskDetail";
import { mapStatus } from "@/features/tasks/mappers";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    notFound();
  }
  const formattedTask = {
    ...task,
    status: mapStatus(task.status),
  };
  return <TaskDetail task={formattedTask} />;
}
