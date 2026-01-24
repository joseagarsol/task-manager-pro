import TaskCard from "@/features/tasks/components/TaskCard";
import type { Task } from "@/features/tasks/types";

export default function Home() {
  const highPriorityTask: Task = {
    id: "1",
    title: "Diseñar base de datos",
    description: "Definir tablas y relaciones",
    status: "Backlog",
    priority: "High",
    createdAt: new Date(),
    estimatedAt: new Date("2026-02-15"),
  };

  const mediumPriorityTask: Task = {
    id: "2",
    title: "Crear componentes UI",
    description: "Implementar botones y inputs",
    status: "In Progress",
    priority: "Medium",
    createdAt: new Date(),
    estimatedAt: new Date("2026-02-20"),
  };

  const doneTask: Task = {
    id: "3",
    title: "Configurar CI/CD",
    description: "Github Actions para tests",
    status: "Done",
    priority: "Low",
    createdAt: new Date("2026-01-01"),
    estimatedAt: new Date("2026-01-10"),
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-gray-800">TaskCard Preview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center text-gray-600">
            Backlog
          </h2>
          <TaskCard task={highPriorityTask} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center text-gray-600">
            In Progress
          </h2>
          <TaskCard task={mediumPriorityTask} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center text-gray-600">
            Done
          </h2>
          <TaskCard task={doneTask} />
        </div>
      </div>
    </main>
  );
}
