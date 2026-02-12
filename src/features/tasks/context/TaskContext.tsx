import {
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTasksOrder,
} from "../actions";
import { Task } from "../types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  editTaskStatus: (taskId: Task["id"], status: Task["status"]) => Promise<void>;
  getTaskById: (taskId: Task["id"]) => Task | undefined;
  removeTask: (taskId: Task["id"]) => Promise<void>;
  moveTaskToFilledColumn: (activeTask: Task, overTask: Task) => Promise<void>;
  moveTaskToEmptyColumn: (activeTask: Task, status: Task["status"]) => void;
  reorderTasks: (activeTask: Task, overTask?: Task) => Promise<void>;
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

  const editTaskStatus = async (
    activeTaskId: Task["id"],
    status: Task["status"],
  ) => {
    try {
      await updateTaskStatus(activeTaskId, status);
    } catch (error) {
      console.error("Failed to update status", error);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === activeTaskId ? { ...t, status: status } : t,
        ),
      );
    }
  };

  const addTask = async (task: Task) => {
    try {
      const taskColumn = tasks
        .filter((t) => t.status === task.status)
        .sort((a, b) => a.columnOrder - b.columnOrder);

      const newTask = await createTask({
        ...task,
        columnOrder: taskColumn.length + 1,
      });
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
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setTasks((prev) => {
      const taskColumn = prev
        .filter((t) => t.status === task.status)
        .sort((a, b) => a.columnOrder - b.columnOrder);

      const updatedTasks = taskColumn.map((t) => {
        if (t.columnOrder > task.columnOrder) {
          return { ...t, columnOrder: t.columnOrder - 1 };
        }
        return t;
      });

      const taskColumnWithoutDeletedTask = updatedTasks.filter(
        (t) => t.id !== task.id,
      );

      const otherTasks = prev.filter((t) => t.status !== task.status);

      return [...otherTasks, ...taskColumnWithoutDeletedTask];
    });
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const moveTaskToFilledColumn = async (activeTask: Task, overTask: Task) => {
    setTasks((prevTasks) => {
      const activeIndex = prevTasks.findIndex((t) => t.id === activeTask.id);
      const overIndex = prevTasks.findIndex((t) => t.id === overTask.id);

      if (activeIndex === -1 || overIndex === -1) return prevTasks;

      const activeTaskUpdated = { ...activeTask, status: overTask.status };

      const updatedTasks = prevTasks.map((t) =>
        t.id === activeTask.id ? activeTaskUpdated : t,
      );

      return arrayMove(updatedTasks, activeIndex, overIndex);
    });
  };

  const moveTaskToEmptyColumn = (activeTask: Task, status: Task["status"]) => {
    setTasks((prevTasks) => {
      const activeTaskUpdated = { ...activeTask, status };
      const updatedTasks = prevTasks.map((t) =>
        t.id === activeTask.id ? activeTaskUpdated : t,
      );
      return updatedTasks;
    });
  };

  const reorderTasks = async (activeTask: Task, overTask?: Task) => {
    if (overTask) {
      const taskColumn = tasks
        .filter((t) => t.status === overTask.status)
        .sort((a, b) => a.columnOrder - b.columnOrder);

      const activeIndex = taskColumn.findIndex((t) => t.id === activeTask.id);
      const overIndex = taskColumn.findIndex((t) => t.id === overTask.id);

      const movedTasks = arrayMove(taskColumn, activeIndex, overIndex);

      const taskInColumnWithNewOrder = movedTasks.map((t, index) => ({
        ...t,
        columnOrder: index + 1,
        status: overTask.status,
      }));

      const otherTasks = tasks.filter((t) => t.status !== overTask.status);
      const newTasks = [...otherTasks, ...taskInColumnWithNewOrder];

      setTasks(newTasks);

      try {
        await updateTasksOrder(taskInColumnWithNewOrder);
      } catch (error) {
        console.error("Failed to update tasks order", error);
      }
      return;
    }

    const movedTask = { ...activeTask, columnOrder: 1 };
    const movedTasks = tasks.map((t) => {
      if (t.id === activeTask.id) {
        return movedTask;
      }
      return t;
    });
    setTasks(movedTasks);

    try {
      await updateTasksOrder([movedTask]);
    } catch (error) {
      console.error("Failed to update tasks order", error);
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
        moveTaskToFilledColumn,
        moveTaskToEmptyColumn,
        reorderTasks,
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
