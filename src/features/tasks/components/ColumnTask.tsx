import { Task } from "../types";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

interface ColumnTaskProps {
  status: Task["status"];
  totalTasks: number;
  tasks: Task[];
}

export default function ColumnTask({
  status,
  totalTasks,
  tasks,
}: ColumnTaskProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      key={status}
      className="flex h-full min-w-[300px] flex-1 flex-col rounded-xl border bg-secondary/10 p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{status}</h3>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {totalTasks}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {totalTasks === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No hay tareas
          </p>
        )}
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
      </div>
    </div>
  );
}
