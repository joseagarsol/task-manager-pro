import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TasksPageClient from "./TasksPageClient";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/tasks",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("../hooks/useTaskNavigation", () => ({
  useTaskNavigation: () => ({
    openTask: vi.fn(),
    closeTask: vi.fn(),
  }),
}));

describe("TasksPageClient Component", () => {
  it("Should open the task form when the button is clicked", async () => {
    render(<TasksPageClient initialTasks={[]} />);
    const button = screen.getByRole("button", { name: /nueva tarea/i });
    await userEvent.click(button);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
