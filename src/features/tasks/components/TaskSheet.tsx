import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { useTaskNavigation } from "../hooks/useTaskNavigation";
import { getTask } from "../actions";
import { useEffect, useState } from "react";
import { Task } from "../types";

export default function TaskSheet() {
  const searchParams = useSearchParams();
  const { closeTask } = useTaskNavigation();

  const taskId = searchParams.get("taskId");

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getTask(taskId);
          setTask(data);
        } catch (err) {
          console.error(err);
          setError("No se pudo cargar la tarea.");
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    } else {
      setTask(null);
    }
  }, [taskId]);

  const isOpen = !!taskId;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeTask();
      }}
    >
      <SheetContent>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : task ? (
          <SheetHeader>
            <SheetTitle>{task.title}</SheetTitle>
            <SheetDescription>
              {task.description || "Sin descripción"}
            </SheetDescription>
          </SheetHeader>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
