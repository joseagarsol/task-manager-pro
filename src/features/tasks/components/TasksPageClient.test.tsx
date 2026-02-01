import TasksPageClient from "./TasksPageClient";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("TasksPageClient Component", () => {
  it("Should open the task form when the button is clicked", () => {
    render(<TasksPageClient initialTasks={[]} />);
    const button = screen.getByRole("button", { name: /nueva tarea/i });
    fireEvent.click(button);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
