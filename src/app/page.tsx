// import prisma from "@/lib/prisma";
// import { Task } from "@/features/tasks/types";

export default async function Home() {
  // const tasks = await prisma.task.findMany({
  //   orderBy: {
  //     columnOrder: "asc",
  //   },
  // });

  // const formattedTasks: Task[] = tasks.map((task) => ({
  //   ...task,
  //   status:
  //     task.status === "InProgress"
  //       ? "In Progress"
  //       : (task.status as Task["status"]),
  // }));

  return <p className="text-primary">Hola</p>;
}
