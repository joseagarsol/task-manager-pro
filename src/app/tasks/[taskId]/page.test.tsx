import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskPage from "./page";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

vi.mock("@/lib/prisma", () => ({
  default: {
    task: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

describe("TaskPage", () => {
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
