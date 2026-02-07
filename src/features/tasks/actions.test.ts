import { describe, it, expect, vi } from "vitest";
import {
  createTask,
  updateTask,
  getTask,
  deleteTask,
  updateTaskStatus,
} from "./actions";
import { Task } from "./types";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    task: {
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Actions", () => {
  describe("createTask", () => {
    it("should return error message if task is invalid", async () => {
      const task: Task = {
        id: "1",
        columnOrder: 1,
        title: "",
        description: "",
        status: "Backlog",
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      };

      await expect(createTask(task)).rejects.toThrow("Datos inválidos: ");
    });

    it("should call api with task data", async () => {
      const task: Task = {
        id: "1",
        columnOrder: 1,
        title: "Task 1",
        description: "Description 1",
        status: "In Progress",
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      };

      vi.mocked(prisma.task.count).mockResolvedValue(0);
      vi.mocked(prisma.task.create).mockResolvedValue({
        ...task,
        status: "InProgress",
      });

      const response = await createTask(task);

      expect(response).toEqual(task);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: task.title,
          description: task.description,
          status: "InProgress",
          priority: task.priority,
          createdAt: task.createdAt,
          estimatedAt: task.estimatedAt,
          columnOrder: 1,
        },
      });
    });
  });

  describe("updateTask", () => {
    it("should return error message if task is invalid", async () => {
      const task: Task = {
        id: "1",
        columnOrder: 1,
        title: "",
        description: "",
        status: "Backlog",
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      };

      await expect(updateTask(task)).rejects.toThrow("Datos inválidos: ");
    });

    it("should call api with task data", async () => {
      const task: Task = {
        id: "1",
        columnOrder: 1,
        title: "Task 1",
        description: "Description 1",
        status: "In Progress",
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      };

      vi.mocked(prisma.task.update).mockResolvedValue({
        ...task,
        status: "InProgress",
      });

      const response = await updateTask(task);

      expect(response).toEqual(task);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
        data: {
          title: task.title,
          description: task.description,
          status: "InProgress",
          priority: task.priority,
          createdAt: task.createdAt,
          estimatedAt: task.estimatedAt,
        },
      });
    });
  });
  describe("getTask", () => {
    it("should return task data", async () => {
      const task: Task = {
        id: "1",
        columnOrder: 1,
        title: "Task 1",
        description: "Description 1",
        status: "In Progress",
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      };

      vi.mocked(prisma.task.findUnique).mockResolvedValue({
        ...task,
        status: "InProgress",
      });

      const response = await getTask(task.id);

      expect(response).toEqual(task);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
      });
    });
  });
  describe("deleteTask", () => {
    it("should call api with task data", async () => {
      const task: Task = {
        id: "1",
        columnOrder: 1,
        title: "Task 1",
        description: "Description 1",
        status: "In Progress",
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      };

      vi.mocked(prisma.task.delete).mockResolvedValue({
        ...task,
        status: "InProgress",
      });

      const response = await deleteTask(task.id);

      expect(response).toEqual(task);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
      });
    });
  });
  describe("updateTaskStatus", () => {
    it("should return task error message if status is invalid", async () => {
      const taskId: Task["id"] = "1";
      const taskStatus = "Invalid";

      await expect(
        updateTaskStatus(taskId, taskStatus as Task["status"]),
      ).rejects.toThrow("Datos inválidos: ");
    });
    it("should call api with task data", async () => {
      const task: Task = {
        id: "1",
        columnOrder: 1,
        title: "Task 1",
        description: "Description 1",
        status: "In Progress",
        priority: "Low",
        createdAt: new Date(),
        estimatedAt: new Date(),
      };

      vi.mocked(prisma.task.update).mockResolvedValue({
        ...task,
        status: "InProgress",
      });

      const response = await updateTaskStatus(task.id, task.status);

      expect(response).toEqual(task);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
        data: {
          status: "InProgress",
        },
      });
    });
  });
});
