import { Task } from "../types";

interface TaskFormProps {
  task?: Task;
  handleSubmit: (task: Task) => void;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TaskForm({ task, handleSubmit }: TaskFormProps) {
  const defaultStatus = "Backlog";
  const defaultPriority = "Low";

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as Task["title"];
    const description = formData.get("description") as Task["description"];
    const status = formData.get("status") as Task["status"];
    const priority = formData.get("priority") as Task["priority"];
    const createdAtStr = formData.get("createdAt") as string;
    const estimatedAtStr = formData.get("estimatedAt") as string;

    const taskData: Task = {
      id: "",
      title,
      description,
      status,
      priority,
      createdAt: createdAtStr ? new Date(createdAtStr) : new Date(),
      estimatedAt: estimatedAtStr ? new Date(estimatedAtStr) : new Date(),
    };

    handleSubmit(taskData);
  };

  return (
    <form onSubmit={(e) => submitForm(e)}>
      <label htmlFor="title">Título</label>
      <input id="title" name="title" type="text" defaultValue={task?.title} />

      <label htmlFor="description">Descripción</label>
      <input
        id="description"
        name="description"
        type="text"
        defaultValue={task?.description}
      />

      <label htmlFor="status">Estado</label>
      <select
        id="status"
        name="status"
        defaultValue={task?.status || defaultStatus}
      >
        <option value="Backlog">Backlog</option>
        <option value="In Progress">En Progreso</option>
        <option value="Done">Completada</option>
      </select>

      <label htmlFor="priority">Prioridad</label>
      <select
        id="priority"
        name="priority"
        defaultValue={task?.priority || defaultPriority}
      >
        <option value="Low">Baja</option>
        <option value="Medium">Media</option>
        <option value="High">Alta</option>
      </select>

      <label htmlFor="createdAt">Fecha de Creación</label>
      <input
        id="createdAt"
        name="createdAt"
        type="date"
        defaultValue={task?.createdAt ? formatDate(task.createdAt) : ""}
      />

      <label htmlFor="estimatedAt">Fecha Estimada</label>
      <input
        id="estimatedAt"
        name="estimatedAt"
        type="date"
        defaultValue={task?.estimatedAt ? formatDate(task.estimatedAt) : ""}
      />
      <button type="submit">Guardar</button>
    </form>
  );
}
