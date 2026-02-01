"use client";

import { useTask } from "@/features/tasks/hooks/useTask";
import TaskList from "@/features/tasks/components/TaskList";
import type { Task } from "@/features/tasks/types";
import TaskDialog from "@/features/tasks/components/TaskDialog";
import { Button } from "@/components/ui/button";

interface TasksPageClientProps {
  initialTasks: Task[];
}

export default function TasksPageClient({
  initialTasks,
}: TasksPageClientProps) {
  const { tasks, addTask, updateTaskStatus } = useTask(initialTasks);

  const newTaskBtn = <Button variant="outline">Nueva Tarea</Button>;

  const handleSubmit = (task: Task) => {
    addTask(task);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-gray-800">TaskList Preview</h1>
      <div className="w-full max-w-5xl">
        <TaskDialog trigger={newTaskBtn} handleSubmit={handleSubmit} />
        <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} />
      </div>
    </main>
  );
}
