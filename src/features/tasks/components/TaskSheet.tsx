import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Hash,
  Tag,
  AlignLeft,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useTaskNavigation } from "../hooks/useTaskNavigation";
import { getTask } from "../actions";
import { useEffect, useState } from "react";
import { Task } from "../types";
import { cn } from "@/lib/utils";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const getPriorityConfig = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return {
        variant: "destructive",
        icon: AlertCircle,
        label: "Alta",
        color: "text-destructive",
      } as const;
    case "Medium":
      return {
        variant: "default",
        icon: Circle,
        label: "Media",
        color: "text-orange-500",
      } as const;
    case "Low":
      return {
        variant: "secondary",
        icon: Circle,
        label: "Baja",
        color: "text-blue-500",
      } as const;
    default:
      return {
        variant: "outline",
        icon: Circle,
        label: priority,
        color: "text-gray-500",
      } as const;
  }
};

const getStatusConfig = (status: Task["status"]) => {
  switch (status) {
    case "Done":
      return {
        variant: "secondary",
        icon: CheckCircle2,
        label: "Completada",
        className:
          "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
      } as const;
    case "In Progress":
      return {
        variant: "default",
        icon: Clock,
        label: "En Progreso",
        className:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
      } as const;
    case "Backlog":
      return {
        variant: "outline",
        icon: Circle,
        label: "Pendiente",
        className:
          "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
      } as const;
    default:
      return {
        variant: "outline",
        icon: Circle,
        label: status,
        className: "",
      } as const;
  }
};

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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-full flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Cargando detalles...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="font-medium text-destructive">{error}</p>
          <Button variant="outline" onClick={closeTask}>
            Cerrar
          </Button>
        </div>
      );
    }

    if (!task) return null;

    const priorityConfig = getPriorityConfig(task.priority);
    const statusConfig = getStatusConfig(task.status);
    const PriorityIcon = priorityConfig.icon;
    const StatusIcon = statusConfig.icon;

    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn(
                "flex w-fit items-center gap-1 font-medium",
                statusConfig.className,
              )}
            >
              <StatusIcon size={12} />
              {statusConfig.label}
            </Badge>
            <div className="flex items-center gap-1 mr-12 text-xs text-muted-foreground">
              <Hash size={12} />
              <span className="font-mono">{task.id.slice(0, 8)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <SheetTitle className="text-2xl font-bold leading-tight tracking-tight">
              {task.title}
            </SheetTitle>
            <SheetDescription className="hidden">
              Detalles de la tarea {task.title}
            </SheetDescription>
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Tag size={12} /> Prioridad
              </span>
              <div className="flex items-center gap-2">
                <PriorityIcon size={16} className={priorityConfig.color} />
                <span className="text-sm font-medium">
                  {priorityConfig.label}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Clock size={12} /> Estimación
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  task.estimatedAt < new Date() && task.status !== "Done"
                    ? "text-destructive"
                    : "",
                )}
              >
                {formatDate(task.estimatedAt)}
              </span>
            </div>

            <div className="space-y-1 col-span-2">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Calendar size={12} /> Creada el
              </span>
              <span className="text-sm">{formatDate(task.createdAt)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlignLeft size={16} />
              Descripción
            </h3>
            <div className="rounded-md bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground border">
              {task.description ? (
                task.description
              ) : (
                <span className="italic text-muted-foreground/50">
                  Sin descripción proporcionada.
                </span>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="pt-4 sm:justify-between">
          <Button
            variant="ghost"
            onClick={closeTask}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
          <Button className="w-full sm:w-auto">Editar Tarea</Button>
        </SheetFooter>
      </div>
    );
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeTask();
      }}
    >
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col h-full border-l shadow-2xl">
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
