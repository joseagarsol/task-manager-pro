import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTask, TaskProvider } from "./TaskContext";
import { Task } from "../types";
import { ReactNode } from "react";

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
});
