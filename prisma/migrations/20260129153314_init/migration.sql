-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Backlog', 'InProgress', 'Done');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'Backlog',
    "priority" "Priority" NOT NULL DEFAULT 'Low',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedAt" TIMESTAMP(3) NOT NULL,
    "columnOrder" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
