import { describe, it, expect, vi, afterEach } from "vitest";
import type { Task } from "@/features/tasks/types";
import { render, screen } from "@testing-library/react";
import TaskList from "./TaskList";

vi.mock("./ColumnTask", () => ({
  default: () => <div>ColumnTask</div>,
}));

describe("TaskList Component", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it("Should render ColumnTask for each status", () => {
    vi.setSystemTime(new Date("January 24, 2026"));

    const mockHighPriorityTask: Task = {
      id: "1",
      title: "Diseñar base de datos",
      description: "Definir tablas y relaciones",
      columnOrder: 1,
      status: "Backlog",
      priority: "High",
      createdAt: new Date(),
      estimatedAt: new Date("2026-02-15"),
    };

    const mockMediumPriorityTask: Task = {
      id: "2",
      title: "Crear componentes UI",
      description: "Implementar botones y inputs",
      columnOrder: 2,
      status: "In Progress",
      priority: "Medium",
      createdAt: new Date("2026-01-01"),
      estimatedAt: new Date("2026-02-20"),
    };

    const mockDoneTask: Task = {
      id: "3",
      title: "Configurar CI/CD",
      description: "Github Actions para tests",
      columnOrder: 3,
      status: "Done",
      priority: "Low",
      createdAt: new Date("2026-01-25"),
      estimatedAt: new Date("2026-02-06"),
    };

    const mockTasks: Task[] = [
      mockHighPriorityTask,
      mockMediumPriorityTask,
      mockDoneTask,
    ];

    render(<TaskList tasks={mockTasks} updateTaskStatus={vi.fn()} />);
    expect(screen.getAllByText("ColumnTask")).toHaveLength(3);
  });
});
