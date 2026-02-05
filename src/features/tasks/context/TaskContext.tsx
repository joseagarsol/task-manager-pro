import { createTask, updateTask } from "../actions";
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
  updateTaskStatus: (taskId: Task["id"], status: Task["status"]) => void;
  getTaskById: (taskId: Task["id"]) => Task | undefined;
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        updateTaskStatus,
        getTaskById,
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

export const useToggle = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, toggle };
};
