import { createTask } from "../actions";
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

  const addTask = async (task: Task) => {
    try {
      const newTask = await createTask(task);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  return {
    tasks,
    updateTaskStatus,
    addTask,
  };
}
