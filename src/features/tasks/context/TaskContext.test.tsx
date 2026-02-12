import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTask, TaskProvider } from "./TaskContext";
import { Task } from "../types";
import { ReactNode } from "react";
import { updateTasksOrder } from "../actions";

const mockTask: Task = {
  id: "1",
  title: "Tarea Original",
  description: "Desc Original",
  status: "Backlog",
  columnOrder: 1,
  priority: "Low",
  createdAt: new Date(),
  estimatedAt: new Date(),
};

vi.mock("../actions", () => ({
  createTask: vi.fn(),
  updateTask: vi.fn((task) => Promise.resolve(task)),
  deleteTask: vi.fn((taskId) => Promise.resolve(mockTask)),
  updateTaskStatus: vi.fn((taskId, status) => Promise.resolve(mockTask)),
  updateTasksOrder: vi.fn(() => Promise.resolve([])),
}));

describe("useTask", () => {
  it("should update the task status", async () => {
    const mockTasks: Task[] = [mockTask];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    await act(async () => {
      await result.current.editTaskStatus(mockTasks[0].id, "Backlog");
    });

    expect(result.current.tasks[0].status).toBe("Backlog");
  });

  it("should update task details when editTask is called", async () => {
    const mockTasks: Task[] = [mockTask];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    const updatedTaskData = {
      ...mockTasks[0],
      title: "Tarea Editada",
    };

    await act(async () => {
      await result.current.editTask(updatedTaskData);
    });

    expect(result.current.tasks[0].title).toBe("Tarea Editada");
  });

  it("should delete task when deleteTask is called", async () => {
    const mockTasks: Task[] = [mockTask];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    await act(async () => {
      await result.current.removeTask(mockTasks[0].id);
    });

    expect(result.current.tasks).not.toContainEqual(mockTasks[0]);
  });

  it("should move task to filled column", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Tarea Original",
        description: "Desc Original",
        status: "Backlog",
        columnOrder: 1,
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      },
      {
        id: "2",
        title: "Tarea Original",
        description: "Desc Original",
        status: "In Progress",
        columnOrder: 1,
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      },
    ];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    await act(async () => {
      await result.current.moveTaskToFilledColumn(mockTasks[0], mockTasks[1]);
    });

    expect(result.current.tasks[0].status).toBe("In Progress");
  });

  it("should move task to empty column", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Tarea Original",
        description: "Desc Original",
        status: "Backlog",
        columnOrder: 1,
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      },
    ];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    await act(async () => {
      await result.current.moveTaskToEmptyColumn(mockTasks[0], "In Progress");
    });

    expect(result.current.tasks[0].status).toBe("In Progress");
  });

  it("should reorder tasks with overTask", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Tarea Original 1",
        description: "Desc Original",
        status: "Backlog",
        columnOrder: 1,
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      },
      {
        id: "2",
        title: "Tarea Original 2",
        description: "Desc Original",
        status: "Backlog",
        columnOrder: 2,
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      },
    ];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    await act(async () => {
      await result.current.reorderTasks(mockTasks[0], mockTasks[1]);
    });

    expect(result.current.tasks[1].title).toBe("Tarea Original 1");
    expect(result.current.tasks[1].columnOrder).toBe(2);
  });

  it("should reorder tasks without overTask", async () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Tarea Original 1",
        description: "Desc Original",
        status: "Backlog",
        columnOrder: 4,
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      },
    ];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    await act(async () => {
      await result.current.reorderTasks(mockTasks[0]);
    });

    expect(result.current.tasks[0].columnOrder).toBe(1);
  });
});
