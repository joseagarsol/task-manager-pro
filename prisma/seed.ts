import { PrismaClient, Prisma } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const tasksData: Prisma.TaskCreateInput[] = [
  {
    title: "Task 1",
    description: "Description 1",
    status: "Backlog",
    priority: "High",
    estimatedAt: new Date(),
    columnOrder: 1,
  },
  {
    title: "Task 2",
    description: "Description 2",
    status: "Backlog",
    priority: "Medium",
    estimatedAt: new Date(),
    columnOrder: 2,
  },
];

export async function main() {
  for (const taskData of tasksData) {
    await prisma.task.create({ data: taskData });
  }
}

main();
