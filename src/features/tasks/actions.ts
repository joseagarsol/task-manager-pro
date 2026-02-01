"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Task } from "./types";

import { createTaskSchema } from "./schemas";

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

  const reverseStatusMap: Record<string, Task["status"]> = {
    Backlog: "Backlog",
    InProgress: "In Progress",
    Done: "Done",
  };

  return {
    ...newTask,
    status: reverseStatusMap[newTask.status],
  };
}
