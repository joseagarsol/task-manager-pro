import { Task } from "../types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import ColumnTask from "./ColumnTask";

interface TaskListProps {
  tasks: Task[];
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
}

export default function TaskList({ tasks, updateTaskStatus }: TaskListProps) {
  const columns: Task["status"][] = ["Backlog", "In Progress", "Done"];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);

    if (activeTask && activeTask.status !== over.id) {
      updateTaskStatus(activeTask.id.toString(), over.id as Task["status"]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {columns.map((status) => (
          <ColumnTask
            key={status}
            status={status}
            totalTasks={tasks.filter((t) => t.status === status).length}
            tasks={tasks}
          />
        ))}
      </div>
    </DndContext>
  );
}
