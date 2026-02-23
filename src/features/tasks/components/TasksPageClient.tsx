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
  const {
    tasks,
    addTask,
    editTaskStatus,
    moveTaskToFilledColumn,
    moveTaskToEmptyColumn,
    reorderTasks,
  } = useTask();

  const newTaskBtn = <Button>Nueva Tarea</Button>;

  const handleSubmit = (task: Task) => {
    addTask(task);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-bold">Tablero</h1>
        <TaskDialog trigger={newTaskBtn} handleSubmit={handleSubmit} />
      </div>
      <div className="flex-1 min-h-0 overflow-x-auto">
        <TaskList
          tasks={tasks}
          editTaskStatus={editTaskStatus}
          moveTaskToFilledColumn={moveTaskToFilledColumn}
          moveTaskToEmptyColumn={moveTaskToEmptyColumn}
          reorderTasks={reorderTasks}
        />
      </div>
      <TaskSheet />
    </div>
  );
}

export default function TasksPageClient({
  initialTasks,
}: TasksPageClientProps) {
  return (
    <div className="h-full w-full">
      <TaskProvider initialTasks={initialTasks}>
        <TaskManagerContent />
      </TaskProvider>
    </div>
  );
}
