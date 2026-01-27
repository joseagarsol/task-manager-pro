import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTask } from "./useTask";
import { Task } from "../types";

describe("useTask", () => {
  it("should update the task status", () => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Tarea 1",
        description: "Descripción 1",
        status: "Backlog",
        priority: "Low",
        createdAt: new Date(2026, 0, 24),
        estimatedAt: new Date(2026, 1, 28),
      },
    ];

    const { result } = renderHook(() => useTask(mockTasks));

    act(() => {
      result.current.updateTaskStatus(mockTasks[0].id, "In Progress");
    });

    expect(result.current.tasks[0].status).toBe("In Progress");
  });
});
