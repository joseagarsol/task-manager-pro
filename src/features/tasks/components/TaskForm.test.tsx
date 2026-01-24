import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "./TaskForm";
import { Task } from "../types";

describe("TaskForm Component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a form with empty fields", () => {
    const handleSubmit = vi.fn();

    render(<TaskForm handleSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const statusInput = screen.getByLabelText(/estado/i);
    const priorityInput = screen.getByLabelText(/prioridad/i);
    const createdAtInput = screen.getByLabelText(/fecha de creación/i);
    const estimatedAtInput = screen.getByLabelText(/fecha estimada/i);

    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
    expect(statusInput).toHaveValue("Backlog");
    expect(priorityInput).toHaveValue("Low");
    expect(createdAtInput).toHaveValue("");
    expect(estimatedAtInput).toHaveValue("");
  });

  it("Should render a form with a task data", () => {
    vi.setSystemTime(new Date("January 24, 2026"));
    const task: Task = {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      status: "Backlog",
      priority: "Low",
      createdAt: new Date(),
      estimatedAt: new Date("2026-02-28"),
    };

    const handleSubmit = vi.fn();

    render(<TaskForm task={task} handleSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const statusInput = screen.getByLabelText(/estado/i);
    const priorityInput = screen.getByLabelText(/prioridad/i);
    const createdAtInput = screen.getByLabelText(/fecha de creación/i);
    const estimatedAtInput = screen.getByLabelText(/fecha estimada/i);

    expect(titleInput).toHaveValue("Task 1");
    expect(descriptionInput).toHaveValue("Description 1");
    expect(statusInput).toHaveValue("Backlog");
    expect(priorityInput).toHaveValue("Low");
    expect(createdAtInput).toHaveValue("2026-01-24");
    expect(estimatedAtInput).toHaveValue("2026-02-28");
  });

  it("Should call handleSubmit when the form is submitted", () => {
    const handleSubmit = vi.fn();

    render(<TaskForm handleSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const statusInput = screen.getByLabelText(/estado/i);
    const priorityInput = screen.getByLabelText(/prioridad/i);
    const createdAtInput = screen.getByLabelText(/fecha de creación/i);
    const estimatedAtInput = screen.getByLabelText(/fecha estimada/i);

    fireEvent.change(titleInput, { target: { value: "Task 1" } });
    fireEvent.change(descriptionInput, { target: { value: "Description 1" } });
    fireEvent.change(statusInput, { target: { value: "Backlog" } });
    fireEvent.change(priorityInput, { target: { value: "Low" } });
    fireEvent.change(createdAtInput, { target: { value: "2026-01-24" } });
    fireEvent.change(estimatedAtInput, { target: { value: "2026-02-28" } });

    fireEvent.click(screen.getByRole("button", { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      id: "",
      title: "Task 1",
      description: "Description 1",
      status: "Backlog",
      priority: "Low",
      createdAt: new Date("2026-01-24"),
      estimatedAt: new Date("2026-02-28"),
    });
  });
});
