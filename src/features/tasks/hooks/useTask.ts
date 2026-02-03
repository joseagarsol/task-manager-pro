import { createTask, updateTask } from "../actions";
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

  const editTask = async (taskToEdit: Task) => {
    try {
      const updatedTask = await updateTask(taskToEdit);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskToEdit.id ? updatedTask : task)),
      );
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const getTaskById = (taskId: Task["id"]) => {
    return tasks.find((task) => task.id === taskId);
  };

  return {
    tasks,
    updateTaskStatus,
    addTask,
    editTask,
    getTaskById,
  };
}
