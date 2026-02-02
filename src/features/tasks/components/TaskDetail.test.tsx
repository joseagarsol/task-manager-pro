import { describe, it, expect, vi } from "vitest";
import TaskDetail from "./TaskDetail";
import { render, screen } from "@testing-library/react";
import type { Task } from "../types";
import { wrapperDate } from "@/lib/utils";

describe("TaskDetail", () => {
  it("should render task detail", () => {
    vi.setSystemTime(new Date("February 2, 2026"));
    const mockTask: Task = {
      id: "1",
      title: "Test Task",
      columnOrder: 1,
      createdAt: new Date(),
      estimatedAt: new Date("February 27, 2026"),
      description: "Description",
      status: "Backlog",
      priority: "Medium",
    };

    render(<TaskDetail task={mockTask} />);

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description!)).toBeInTheDocument();
    expect(screen.getByText(mockTask.status)).toBeInTheDocument();
    expect(screen.getByText(mockTask.priority)).toBeInTheDocument();
    expect(
      screen.getByText(wrapperDate(mockTask.estimatedAt)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(wrapperDate(mockTask.createdAt)),
    ).toBeInTheDocument();
  });
});
