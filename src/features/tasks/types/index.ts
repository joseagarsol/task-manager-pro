type Status = "Backlog" | "In Progress" | "Done";
type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  estimatedAt: Date;
}
