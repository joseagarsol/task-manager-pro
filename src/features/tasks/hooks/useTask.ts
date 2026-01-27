import { Task } from "../types";
import { useState } from "react";

export function useTask(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const updateTaskStatus = (taskId: Task["id"], status: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );
  };

  return {
    tasks,
    updateTaskStatus,
  };
}
