import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskPage from "./page";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    task: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("TaskPage", () => {
  it("should render task title when task is found", async () => {
    const mockTask = {
      id: "1",
      title: "Test Task",
      description: "Description",
      status: "Backlog",
      priority: "Medium",
    };

    (prisma.task.findUnique as Mock).mockResolvedValue(mockTask);

    const params = Promise.resolve({ taskId: "1" });
    const Page = await TaskPage({ params });
    render(Page);

    expect(screen.getByText("Hi Test Task")).toBeInTheDocument();
    expect(prisma.task.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });

  it("should call notFound when task is not found", async () => {
    (prisma.task.findUnique as Mock).mockResolvedValue(null);

    const params = Promise.resolve({ taskId: "non-existent" });

    try {
      await TaskPage({ params });
    } catch (e) {
      // In Next.js notFound() throws an error that is caught by the framework
    }

    expect(notFound).toHaveBeenCalled();
  });
});
