import { describe, it, expect, vi, afterEach } from "vitest";
import type { Task } from "@/features/tasks/types";
import { render, screen } from "@testing-library/react";
import TaskList from "./TaskList";

describe("TaskList Component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a list of tasks", () => {
    vi.setSystemTime(new Date("January 24, 2026"));

    const mockHighPriorityTask: Task = {
      id: "1",
      title: "Diseñar base de datos",
      description: "Definir tablas y relaciones",
      status: "Backlog",
      priority: "High",
      createdAt: new Date(),
      estimatedAt: new Date("2026-02-15"),
    };

    const mockMediumPriorityTask: Task = {
      id: "2",
      title: "Crear componentes UI",
      description: "Implementar botones y inputs",
      status: "In Progress",
      priority: "Medium",
      createdAt: new Date("2026-01-01"),
      estimatedAt: new Date("2026-02-20"),
    };

    const mockDoneTask: Task = {
      id: "3",
      title: "Configurar CI/CD",
      description: "Github Actions para tests",
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

    render(<TaskList tasks={mockTasks} />);

    const wrapperDate = (date: Date) =>
      date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });

    const wrapperStatus = (status: Task["status"]) => {
      switch (status) {
        case "Done":
          return "Completada";
        case "In Progress":
          return "En Progreso";
        case "Backlog":
          return "Pendiente";
        default:
          return status;
      }
    };

    const wrapperPriority = (priority: Task["priority"]) => {
      switch (priority) {
        case "High":
          return "Alta";
        case "Medium":
          return "Media";
        case "Low":
          return "Baja";
        default:
          return priority;
      }
    };

    mockTasks.forEach((task) => {
      const title = screen.getByText(task.title);
      const description = screen.getByText(task.description);
      const status = screen.getByText(wrapperStatus(task.status));
      const priority = screen.getByText(wrapperPriority(task.priority));
      const createdAt = screen.getByText(wrapperDate(task.createdAt));
      const estimatedAt = screen.getByText(wrapperDate(task.estimatedAt));
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(status).toBeInTheDocument();
      expect(priority).toBeInTheDocument();
      expect(createdAt).toBeInTheDocument();
      expect(estimatedAt).toBeInTheDocument();
    });
  });
});
