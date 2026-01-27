"use client";

import { useState } from "react";
import TaskList from "@/features/tasks/components/TaskList";
import type { Task } from "@/features/tasks/types";
import TaskDialog from "@/features/tasks/components/TaskDialog";
import { Button } from "@/components/ui/button";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Diseñar base de datos",
    description: "Definir tablas y relaciones",
    status: "Backlog",
    priority: "High",
    createdAt: new Date(),
    estimatedAt: new Date("2026-02-15"),
  },
  {
    id: "2",
    title: "Crear componentes UI",
    description: "Implementar botones y inputs",
    status: "In Progress",
    priority: "Medium",
    createdAt: new Date(),
    estimatedAt: new Date("2026-02-20"),
  },
  {
    id: "3",
    title: "Configurar CI/CD",
    description: "Github Actions para tests",
    status: "Done",
    priority: "Low",
    createdAt: new Date("2026-01-01"),
    estimatedAt: new Date("2026-01-10"),
  },
  {
    id: "4",
    title: "Autenticación",
    description: "Implementar login con NextAuth",
    status: "Backlog",
    priority: "High",
    createdAt: new Date(),
    estimatedAt: new Date("2026-03-01"),
  },
  {
    id: "5",
    title: "Testing E2E",
    description: "Configurar Playwright",
    status: "Backlog",
    priority: "Medium",
    createdAt: new Date("2026-01-20"),
    estimatedAt: new Date("2026-03-10"),
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const newTaskBtn = <Button variant="outline">Nueva Tarea</Button>;

  const handleSubmit = (task: Task) => {
    setTasks([...tasks, task]);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-gray-800">TaskList Preview</h1>
      <div className="w-full max-w-5xl">
        <TaskDialog trigger={newTaskBtn} handleSubmit={handleSubmit} />
        <TaskList tasks={tasks} />
      </div>
    </main>
  );
}
