import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ColumnTask from "./ColumnTask";

describe("ColumnTask Component", () => {
  it("should show a empty state when there are no tasks", () => {
    render(<ColumnTask status="Backlog" totalTasks={0} tasks={[]} />);
    expect(screen.getByText("No hay tareas")).toBeInTheDocument();
  });
});
