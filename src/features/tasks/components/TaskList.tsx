import { Task } from "../types";
import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import ColumnTask from "./ColumnTask";

interface TaskListProps {
  tasks: Task[];
  editTaskStatus: (taskId: string, status: Task["status"]) => Promise<void>;
  moveTaskToFilledColumn: (activeTask: Task, overTask: Task) => Promise<void>;
  moveTaskToEmptyColumn: (activeTask: Task, status: Task["status"]) => void;
  reorderTasks: (activeTask: Task, overTask?: Task) => void;
}

export default function TaskList({
  tasks,
  editTaskStatus,
  moveTaskToFilledColumn,
  moveTaskToEmptyColumn,
  reorderTasks,
}: TaskListProps) {
  const columns: Task["status"][] = ["Backlog", "In Progress", "Done"];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    //Si hemos cambiado a una columna con tareas (puede ser la misma)
    if (overTask && over.data.current) {
      await reorderTasks(activeTask, overTask);
      return;
    }

    //Si cambiamos a una columna vacía
    if (activeTask) {
      if (!over.data.current) {
        await editTaskStatus(activeTask.id, over.id as Task["status"]);
        await reorderTasks(activeTask);
        return;
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    //Si hemos cambiado a una columna con tareas
    if (activeTask && overTask) {
      if (activeTask.status !== overTask.status) {
        moveTaskToFilledColumn(activeTask, overTask);
        return;
      }
    }

    //Si cambiamos a una columna vacía
    if (activeTask) {
      if (!over.data.current) {
        moveTaskToEmptyColumn(activeTask, over.id as Task["status"]);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
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
