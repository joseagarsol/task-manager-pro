import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTask, TaskProvider } from "./TaskContext";
import { Task } from "../types";
import { ReactNode } from "react";

vi.mock("../actions", () => ({
  createTask: vi.fn(),
  updateTask: vi.fn((task) => Promise.resolve(task)),
}));

describe("useTask", () => {
  it("should update the task status", () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Tarea 1",
        description: "Descripción 1",
        status: "Backlog",
        columnOrder: 1,
        priority: "Low",
        createdAt: new Date(2026, 0, 24),
        estimatedAt: new Date(2026, 1, 28),
      },
    ];

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TaskProvider initialTasks={mockTasks}>{children}</TaskProvider>
    );

    const { result } = renderHook(() => useTask(), { wrapper });

    act(() => {
      result.current.updateTaskStatus(mockTasks[0].id, "In Progress");
    });

    expect(result.current.tasks[0].status).toBe("In Progress");
  });

  it("should update task details when editTask is called", async () => {
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

    const updatedTaskData = {
      ...mockTasks[0],
      title: "Tarea Editada",
    };

    await act(async () => {
      await result.current.editTask(updatedTaskData);
    });

    expect(result.current.tasks[0].title).toBe("Tarea Editada");
  });
});
