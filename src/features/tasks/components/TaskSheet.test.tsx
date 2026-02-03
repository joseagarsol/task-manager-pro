import { describe, vi, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TaskSheet from "./TaskSheet";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("taskId=123"),
  usePathname: () => "/board",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("../actions", () => ({
  getTask: vi.fn().mockResolvedValue({
    id: "123",
    title: "Tarea de Prueba",
    description: "Descripción de Prueba",
    status: "Backlog",
    columnOrder: 1,
    priority: "Medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}));

describe("TaskSheet component", () => {
  it("should render task details when taskId is present", async () => {
    render(<TaskSheet />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Tarea de Prueba")).toBeInTheDocument();
      expect(screen.getByText("Descripción de Prueba")).toBeInTheDocument();
    });
  });
});
