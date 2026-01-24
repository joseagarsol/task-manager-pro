import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskCard from "./TaskCard";
import { Task } from "../types";

describe("TaskCard Component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("It should correctly render the task information", () => {
    vi.setSystemTime(new Date("January 20, 2026"));

    const mockTask: Task = {
      id: "123",
      title: "Diseñar base de datos",
      description: "Definir tablas y relaciones",
      status: "Backlog",
      priority: "High",
      createdAt: new Date(),
      estimatedAt: new Date("February 15, 2026"),
    };

    render(<TaskCard task={mockTask} />);

    const wrapperDate = (date: Date) =>
      date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });

    const title = screen.getByText(mockTask.title);
    const description = screen.getByText(mockTask.description);
    const status = screen.getByText("Pendiente");
    const priority = screen.getByText("Alta");
    const createdAt = screen.getByText(wrapperDate(mockTask.createdAt));
    const estimatedAt = screen.getByText(wrapperDate(mockTask.estimatedAt));

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(status).toBeInTheDocument();
    expect(priority).toBeInTheDocument();
    expect(createdAt).toBeInTheDocument();
    expect(estimatedAt).toBeInTheDocument();
  });
});
