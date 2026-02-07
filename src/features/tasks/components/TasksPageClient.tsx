"use client";

import { useTask, TaskProvider } from "@/features/tasks/context/TaskContext";
import TaskList from "@/features/tasks/components/TaskList";
import type { Task } from "@/features/tasks/types";
import TaskDialog from "@/features/tasks/components/TaskDialog";
import { Button } from "@/components/ui/button";
import TaskSheet from "./TaskSheet";

interface TasksPageClientProps {
  initialTasks: Task[];
}

function TaskManagerContent() {
  const { tasks, addTask, editTaskStatus } = useTask();

  const newTaskBtn = <Button variant="outline">Nueva Tarea</Button>;

  const handleSubmit = (task: Task) => {
    addTask(task);
  };

  return (
    <div className="w-full max-w-5xl">
      <TaskDialog trigger={newTaskBtn} handleSubmit={handleSubmit} />
      <TaskList tasks={tasks} updateTaskStatus={editTaskStatus} />
      <TaskSheet />
    </div>
  );
}

export default function TasksPageClient({
  initialTasks,
}: TasksPageClientProps) {
  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-gray-800">TaskList Preview</h1>
      <TaskProvider initialTasks={initialTasks}>
        <TaskManagerContent />
      </TaskProvider>
    </main>
  );
}
