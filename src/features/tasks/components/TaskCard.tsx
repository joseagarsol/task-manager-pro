import { Task } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: Task;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const getPriorityConfig = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return {
        variant: "destructive",
        icon: AlertCircle,
        label: "Alta",
      } as const;
    case "Medium":
      return { variant: "default", icon: Circle, label: "Media" } as const;
    case "Low":
      return { variant: "secondary", icon: Circle, label: "Baja" } as const;
    default:
      return { variant: "outline", icon: Circle, label: priority } as const;
  }
};

const getStatusConfig = (status: Task["status"]) => {
  switch (status) {
    case "Done":
      return {
        variant: "secondary",
        icon: CheckCircle2,
        label: "Completada",
      } as const;
    case "In Progress":
      return { variant: "default", icon: Clock, label: "En Progreso" } as const;
    case "Backlog":
      return { variant: "outline", icon: Circle, label: "Pendiente" } as const;
    default:
      return { variant: "secondary", icon: Circle, label: status } as const;
  }
};

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const PriorityIcon = priorityConfig.icon;
  const StatusIcon = statusConfig.icon;

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handleDoubleClick = () => {
    router.push(`/tasks/${task.id}`);
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="hover:shadow-md transition-shadow duration-200"
      onDoubleClick={handleDoubleClick}
    >
      <CardHeader className="pb-3 pt-5 px-5 space-y-0">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base font-bold leading-tight">
            {task.title}
          </CardTitle>
          <Badge
            variant={priorityConfig.variant}
            className="shrink-0 gap-1 text-[10px] px-2 py-0 h-6"
          >
            <PriorityIcon size={12} />
            {priorityConfig.label}
          </Badge>
        </div>
        <CardDescription className="text-xs pt-1 line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-dashed">
          <Badge
            variant={statusConfig.variant}
            className="gap-1 text-[10px] bg-opacity-90"
          >
            <StatusIcon size={12} />
            {statusConfig.label}
          </Badge>

          <div className="flex flex-col items-end gap-1 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1" title="Fecha de creación">
              <Calendar size={12} />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1",
                task.estimatedAt < new Date()
                  ? "text-destructive font-medium"
                  : "",
              )}
              title="Fecha estimada"
            >
              <Clock size={12} />
              <span>{formatDate(task.estimatedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
