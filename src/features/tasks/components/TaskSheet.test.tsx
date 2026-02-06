import { describe, vi, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskSheet from "./TaskSheet";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useTaskNavigation } from "../hooks/useTaskNavigation";
import { useTask } from "../context/TaskContext";
import { Task } from "../types";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock("../hooks/useTaskNavigation", () => ({
  useTaskNavigation: vi.fn(),
}));

vi.mock("../context/TaskContext", () => ({
  useTask: vi.fn(),
}));

vi.mock("./TaskForm", () => ({
  default: ({ handleSubmit }: { handleSubmit: (task: Task) => void }) => (
    <form
      data-testid="mock-task-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit({
          id: "123",
          title: "Tarea Actualizada",
          description: "Descripción Actualizada",
          status: "In Progress",
          priority: "Medium",
          columnOrder: 1,
          createdAt: new Date("2024-01-01"),
          estimatedAt: new Date("2024-01-02"),
        } as Task);
      }}
    >
      <button type="submit">Guardar Cambios</button>
    </form>
  ),
}));

const createMockTask = (overrides?: Partial<Task>): Task => ({
  id: "123",
  title: "Tarea de Prueba",
  description: "Descripción de Prueba",
  status: "Backlog",
  priority: "High",
  columnOrder: 1,
  createdAt: new Date("2024-01-01T10:00:00"),
  estimatedAt: new Date("2024-01-10T10:00:00"),
  ...overrides,
});

describe("TaskSheet Component", () => {
  const mockCloseTask = vi.fn();
  const mockGetTaskById = vi.fn();
  const mockEditTask = vi.fn();
  const mockSearchParams = new URLSearchParams() as ReadonlyURLSearchParams;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useTaskNavigation).mockReturnValue({
      openTask: vi.fn(),
      closeTask: mockCloseTask,
    });

    vi.mocked(useTask).mockReturnValue({
      tasks: [],
      addTask: vi.fn(),
      editTask: mockEditTask,
      updateTaskStatus: vi.fn(),
      getTaskById: mockGetTaskById,
    });

    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams);
  });

  it("should not render anything significant if no taskId in search params", () => {
    render(<TaskSheet />);

    expect(screen.queryByText("Tarea de Prueba")).not.toBeInTheDocument();
  });

  it("should render 'Tarea no encontrada' if taskId exists but task does not", () => {
    const params = new URLSearchParams();
    params.set("taskId", "999");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );
    mockGetTaskById.mockReturnValue(undefined);

    render(<TaskSheet />);

    expect(screen.getByText("Tarea no encontrada.")).toBeInTheDocument();

    const closeButton = screen.getByText("Cerrar");
    fireEvent.click(closeButton);
    expect(mockCloseTask).toHaveBeenCalled();
  });

  it("should render task details correctly", () => {
    const params = new URLSearchParams();
    params.set("taskId", "123");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );

    const task = createMockTask();
    mockGetTaskById.mockReturnValue(task);

    render(<TaskSheet />);

    expect(screen.getByText("Tarea de Prueba")).toBeInTheDocument();
    expect(screen.getByText("Descripción de Prueba")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("should handle missing description gracefully", () => {
    const params = new URLSearchParams();
    params.set("taskId", "123");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );
    const task = createMockTask({ description: null });
    mockGetTaskById.mockReturnValue(task);

    render(<TaskSheet />);

    expect(
      screen.getByText("Sin descripción proporcionada."),
    ).toBeInTheDocument();
  });

  it("should render correct status and priority styling", () => {
    const params = new URLSearchParams();
    params.set("taskId", "123");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );

    const task = createMockTask({ status: "Done", priority: "Low" });
    mockGetTaskById.mockReturnValue(task);

    render(<TaskSheet />);

    expect(screen.getByText("Completada")).toBeInTheDocument();
    expect(screen.getByText("Baja")).toBeInTheDocument();
  });

  it("should switch to edit mode when 'Editar Tarea' is clicked", () => {
    const params = new URLSearchParams();
    params.set("taskId", "123");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );

    const task = createMockTask();
    mockGetTaskById.mockReturnValue(task);

    render(<TaskSheet />);

    const editButton = screen.getByRole("button", { name: "Editar Tarea" });
    fireEvent.click(editButton);

    expect(screen.getByTestId("mock-task-form")).toBeInTheDocument();
    expect(screen.getByText("Editar Tarea")).toBeInTheDocument();
  });

  it("should call editTask and exit edit mode on successful update", async () => {
    const params = new URLSearchParams();
    params.set("taskId", "123");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );

    const task = createMockTask();
    mockGetTaskById.mockReturnValue(task);

    render(<TaskSheet />);

    fireEvent.click(screen.getByRole("button", { name: "Editar Tarea" }));

    fireEvent.click(screen.getByText("Guardar Cambios"));

    await waitFor(() => {
      expect(mockEditTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Tarea Actualizada",
        }),
      );
    });

    expect(screen.queryByTestId("mock-task-form")).not.toBeInTheDocument();
  });

  it("should cancel edit mode when 'Cancelar' is clicked", () => {
    const params = new URLSearchParams();
    params.set("taskId", "123");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );

    const task = createMockTask();
    mockGetTaskById.mockReturnValue(task);

    render(<TaskSheet />);

    fireEvent.click(screen.getByRole("button", { name: "Editar Tarea" }));
    expect(screen.getByTestId("mock-task-form")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByTestId("mock-task-form")).not.toBeInTheDocument();
    expect(screen.getByText("Tarea de Prueba")).toBeInTheDocument();
  });

  it("should close the sheet when 'Cerrar' is clicked in view mode", () => {
    const params = new URLSearchParams();
    params.set("taskId", "123");
    vi.mocked(useSearchParams).mockReturnValue(
      params as ReadonlyURLSearchParams,
    );

    const task = createMockTask();
    mockGetTaskById.mockReturnValue(task);

    render(<TaskSheet />);

    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    fireEvent.click(closeButton);

    expect(mockCloseTask).toHaveBeenCalled();
  });
});
