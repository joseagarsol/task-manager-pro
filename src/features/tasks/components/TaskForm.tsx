import { Task } from "../types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useTaskForm } from "../hooks/useTaskForm";

interface TaskFormProps {
  task?: Task;
  handleSubmit: (task: Task) => void;
  afterSubmit: () => void;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TaskForm({
  task,
  handleSubmit,
  afterSubmit,
}: TaskFormProps) {
  const {
    errors,
    validateField,
    validateForm,
    setCreatedAt,
    setEstimatedAt,
    createdAt,
    estimatedAt,
  } = useTaskForm(task);
  const [openCreatedAt, setOpenCreatedAt] = useState(false);
  const [openEstimatedAt, setOpenEstimatedAt] = useState(false);

  const defaultStatus = "Backlog";
  const defaultPriority = "Low";

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    const task = validateForm(e);
    if (task) {
      handleSubmit(task);
      afterSubmit();
    }
  };

  return (
    <form onSubmit={(e) => handleForm(e)}>
      <FieldGroup>
        <Field data-invalid={(errors?.title?.length ?? 0) > 0}>
          <FieldLabel htmlFor="title">Título</FieldLabel>
          <Input
            id="title"
            name="title"
            type="text"
            defaultValue={task?.title}
            aria-invalid={(errors?.title?.length ?? 0) > 0}
            onChange={(e) => validateField("title", e.target.value)}
          />
          <FieldDescription>{errors?.title?.[0]}</FieldDescription>
        </Field>
        <Field data-invalid={(errors?.description?.length ?? 0) > 0}>
          <FieldLabel htmlFor="description">Descripción</FieldLabel>
          <Textarea
            id="description"
            name="description"
            defaultValue={task?.description}
            aria-invalid={(errors?.description?.length ?? 0) > 0}
            onChange={(e) => validateField("description", e.target.value)}
          />
          <FieldDescription>{errors?.description?.[0]}</FieldDescription>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={(errors?.status?.length ?? 0) > 0}>
            <FieldLabel htmlFor="status">Estado</FieldLabel>
            <Select
              name="status"
              defaultValue={task?.status || defaultStatus}
              aria-invalid={(errors?.status?.length ?? 0) > 0}
              onValueChange={(value) => validateField("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Backlog">Backlog</SelectItem>
                <SelectItem value="In Progress">En Progreso</SelectItem>
                <SelectItem value="Done">Completada</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>{errors?.status?.[0]}</FieldDescription>
          </Field>
          <Field data-invalid={(errors?.priority?.length ?? 0) > 0}>
            <FieldLabel htmlFor="priority">Prioridad</FieldLabel>
            <Select
              name="priority"
              defaultValue={task?.priority || defaultPriority}
              aria-invalid={(errors?.priority?.length ?? 0) > 0}
              onValueChange={(value) => validateField("priority", value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Selecciona una prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Baja</SelectItem>
                <SelectItem value="Medium">Media</SelectItem>
                <SelectItem value="High">Alta</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>{errors?.priority?.[0]}</FieldDescription>
          </Field>
        </div>
        <Field data-invalid={(errors?.createdAt?.length ?? 0) > 0}>
          <FieldLabel htmlFor="createdAt">Fecha de Creación</FieldLabel>
          <Popover open={openCreatedAt} onOpenChange={setOpenCreatedAt}>
            <PopoverTrigger
              asChild
              data-invalid={(errors?.createdAt?.length ?? 0) > 0}
            >
              <Button
                variant="outline"
                id="createdAt"
                aria-invalid={(errors?.createdAt?.length ?? 0) > 0}
              >
                {createdAt ? (
                  formatDate(createdAt)
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={createdAt}
                onSelect={(date) => {
                  setCreatedAt(date);
                  validateField("createdAt", date);
                  setOpenCreatedAt(false);
                }}
                defaultMonth={createdAt}
              />
            </PopoverContent>
            <FieldDescription>{errors?.createdAt?.[0]}</FieldDescription>
          </Popover>
        </Field>
        <Field data-invalid={(errors?.estimatedAt?.length ?? 0) > 0}>
          <FieldLabel htmlFor="estimatedAt">Fecha Estimada</FieldLabel>
          <Popover open={openEstimatedAt} onOpenChange={setOpenEstimatedAt}>
            <PopoverTrigger
              asChild
              data-invalid={(errors?.estimatedAt?.length ?? 0) > 0}
            >
              <Button
                variant="outline"
                id="estimatedAt"
                aria-invalid={(errors?.estimatedAt?.length ?? 0) > 0}
              >
                {estimatedAt ? (
                  formatDate(estimatedAt)
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={estimatedAt}
                onSelect={(date) => {
                  setEstimatedAt(date);
                  validateField("estimatedAt", date);
                  setOpenEstimatedAt(false);
                }}
                defaultMonth={estimatedAt}
              />
            </PopoverContent>
            <FieldDescription>{errors?.estimatedAt?.[0]}</FieldDescription>
          </Popover>
        </Field>
        <Button type="submit">Guardar</Button>
      </FieldGroup>
    </form>
  );
}
