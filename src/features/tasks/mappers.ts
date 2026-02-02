import { Task } from "./types";

export const mapStatus = (status: string): Task["status"] => {
  return status === "InProgress" ? "In Progress" : (status as Task["status"]);
};
