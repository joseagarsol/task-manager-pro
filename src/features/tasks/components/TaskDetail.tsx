import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  Edit,
  Tag,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { Task } from "../types";

interface TaskDetailProps {
  task: Task;
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Done":
        return "default";
      case "In Progress":
        return "secondary";
      case "Backlog":
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle2 className="mr-1 h-3 w-3" />;
      case "In Progress":
      case "InProgress":
        return <Timer className="mr-1 h-3 w-3" />;
      default:
        return <Circle className="mr-1 h-3 w-3" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  ID: {task.id}
                </span>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Badge
                variant={getStatusVariant(task.status)}
                className="flex items-center"
              >
                {getStatusIcon(task.status)}
                {task.status}
              </Badge>
              <Badge variant={getPriorityVariant(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold text-muted-foreground">
              <Tag className="mr-2 h-4 w-4" />
              Descripción
            </h3>
            <div className="rounded-md bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
              {task.description || (
                <span className="italic text-muted-foreground">
                  Sin descripción proporcionada.
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <h4 className="flex items-center text-xs font-medium text-muted-foreground">
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                Fecha de Creación
              </h4>
              <p className="text-sm font-medium">
                {formatDate(task.createdAt)}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="flex items-center text-xs font-medium text-muted-foreground">
                <Clock className="mr-2 h-3.5 w-3.5" />
                Fecha Estimada
              </h4>
              <p className="text-sm font-medium">
                {formatDate(task.estimatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="pt-6">
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Tablero
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
