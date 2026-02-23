import prisma from "@/lib/prisma";
import TasksPageClient from "@/features/tasks/components/TasksPageClient";
import { Task } from "@/features/tasks/types";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MainSidebar from "@/components/layout/MainSidebar";
import { Separator } from "@/components/ui/separator";

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

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <TasksPageClient initialTasks={formattedTasks} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
