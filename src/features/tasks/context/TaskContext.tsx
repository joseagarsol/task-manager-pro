import {
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../actions";
import { Task } from "../types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  editTaskStatus: (taskId: Task["id"], status: Task["status"]) => void;
  getTaskById: (taskId: Task["id"]) => Task | undefined;
  removeTask: (taskId: Task["id"]) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
  initialTasks: Task[];
}

export function TaskProvider({ children, initialTasks }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const editTaskStatus = async (taskId: Task["id"], status: Task["status"]) => {
    const task = tasks.find((t) => t.id === taskId);
    const previousStatus = task?.status;

    if (!previousStatus) return;

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );

    try {
      await updateTaskStatus(taskId, status);
    } catch (error) {
      console.error("Failed to update status", error);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: previousStatus } : t,
        ),
      );
    }
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

  const removeTask = async (taskId: Task["id"]) => {
    try {
      const deletedTask = await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== deletedTask.id));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        editTaskStatus,
        getTaskById,
        removeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}
