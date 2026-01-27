import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "./TaskForm";
import { Task } from "../types";

const fillForm = async () => {
  const titleInput = screen.getByLabelText(/título/i);
  const descriptionInput = screen.getByLabelText(/descripción/i);
  const statusInput = screen.getByLabelText(/estado/i);
  const priorityInput = screen.getByLabelText(/prioridad/i);

  const createdAtTrigger = screen.getByRole("button", {
    name: /fecha de creación/i,
  });
  const estimatedAtTrigger = screen.getByRole("button", {
    name: /fecha estimada/i,
  });

  fireEvent.change(titleInput, { target: { value: "Task 1" } });
  fireEvent.change(descriptionInput, { target: { value: "Description 1" } });
  fireEvent.change(statusInput, { target: { value: "Backlog" } });
  fireEvent.change(priorityInput, { target: { value: "Low" } });

  fireEvent.click(createdAtTrigger);
  const dayForCreated = screen.getByRole("button", {
    name: /24/,
  });
  fireEvent.click(dayForCreated);
  fireEvent.click(estimatedAtTrigger);

  const nextMonthButton = screen.getByRole("button", {
    name: /next month/i,
  });
  fireEvent.click(nextMonthButton);

  const dayForEstimated = await screen.findByRole("button", {
    name: /28/,
  });
  fireEvent.click(dayForEstimated);

  fireEvent.click(screen.getByRole("button", { name: /guardar/i }));
};

describe("TaskForm Component", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render a form with empty fields", () => {
    const handleSubmit = vi.fn();

    render(<TaskForm handleSubmit={handleSubmit} afterSubmit={vi.fn()} />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const statusInput = screen.getByLabelText(/estado/i);
    const priorityInput = screen.getByLabelText(/prioridad/i);
    const createdAtInput = screen.getByLabelText(/fecha de creación/i);
    const estimatedAtInput = screen.getByLabelText(/fecha estimada/i);

    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
    expect(statusInput).toHaveTextContent("Backlog");
    expect(priorityInput).toHaveTextContent("Baja");
    expect(createdAtInput).toHaveTextContent("Selecciona una fecha");
    expect(estimatedAtInput).toHaveTextContent("Selecciona una fecha");
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

    render(
      <TaskForm
        task={task}
        handleSubmit={handleSubmit}
        afterSubmit={vi.fn()}
      />,
    );

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const statusInput = screen.getByLabelText(/estado/i);
    const priorityInput = screen.getByLabelText(/prioridad/i);
    const createdAtInput = screen.getByLabelText(/fecha de creación/i);
    const estimatedAtInput = screen.getByLabelText(/fecha estimada/i);

    expect(titleInput).toHaveValue("Task 1");
    expect(descriptionInput).toHaveValue("Description 1");
    expect(statusInput).toHaveTextContent("Backlog");
    expect(priorityInput).toHaveTextContent("Baja");
    expect(createdAtInput).toHaveTextContent("2026-01-24");
    expect(estimatedAtInput).toHaveTextContent("2026-02-28");
  });

  it("Should call handleSubmit when the form is submitted", async () => {
    vi.setSystemTime(new Date("January 24, 2026"));

    const handleSubmit = vi.fn();

    render(<TaskForm handleSubmit={handleSubmit} afterSubmit={vi.fn()} />);

    await fillForm();

    expect(handleSubmit).toHaveBeenCalledWith({
      id: "",
      title: "Task 1",
      description: "Description 1",
      status: "Backlog",
      priority: "Low",
      createdAt: new Date(2026, 0, 24),
      estimatedAt: new Date(2026, 1, 28),
    });
  });

  it("Should call afterSubmit when the form is submitted", async () => {
    vi.setSystemTime(new Date("January 24, 2026"));
    const handleSubmit = vi.fn();
    const afterSubmit = vi.fn();

    render(<TaskForm handleSubmit={handleSubmit} afterSubmit={afterSubmit} />);

    await fillForm();

    expect(afterSubmit).toHaveBeenCalled();
  });
});
