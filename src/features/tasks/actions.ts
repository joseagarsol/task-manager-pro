"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Task } from "./types";

import { createTaskSchema } from "./schemas";

const reverseStatusMap: Record<string, Task["status"]> = {
  Backlog: "Backlog",
  InProgress: "In Progress",
  Done: "Done",
};

export async function createTask(task: Task): Promise<Task> {
  const result = createTaskSchema.safeParse(task);

  if (!result.success) {
    throw new Error(
      "Datos inválidos: " + JSON.stringify(z.treeifyError(result.error)),
    );
  }

  const { title, description, status, priority, createdAt, estimatedAt } =
    result.data;

  const statusMap = {
    Backlog: "Backlog",
    "In Progress": "InProgress",
    Done: "Done",
  } as const;

  const prismaStatus = statusMap[status];

  const count = await prisma.task.count({
    where: {
      status: prismaStatus,
    },
  });

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      status: prismaStatus,
      priority,
      createdAt,
      estimatedAt,
      columnOrder: count + 1,
    },
  });

  revalidatePath("/");

  return {
    ...newTask,
    status: reverseStatusMap[newTask.status],
  };
}

export async function getTask(taskId: Task["id"]): Promise<Task> {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return {
    ...task,
    status: reverseStatusMap[task.status],
  };
}

export async function updateTask(task: Task): Promise<Task> {
  const result = createTaskSchema.safeParse(task);

  if (!result.success) {
    throw new Error(
      "Datos inválidos: " + JSON.stringify(z.treeifyError(result.error)),
    );
  }

  const { title, description, status, priority, createdAt, estimatedAt } =
    result.data;

  const statusMap = {
    Backlog: "Backlog",
    "In Progress": "InProgress",
    Done: "Done",
  } as const;

  const prismaStatus = statusMap[status];

  const updatedTask = await prisma.task.update({
    where: {
      id: task.id,
    },
    data: {
      title,
      description,
      status: prismaStatus,
      priority,
      createdAt,
      estimatedAt,
    },
  });

  revalidatePath("/");

  return {
    ...updatedTask,
    status: reverseStatusMap[updatedTask.status],
  };
}
