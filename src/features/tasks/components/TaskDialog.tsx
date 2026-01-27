"use client";

import type { Task } from "../types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "./TaskForm";

interface TaskDialogProps {
  trigger: React.ReactNode;
  handleSubmit: (task: Task) => void;
}

export default function TaskDialog({ trigger, handleSubmit }: TaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const afterSubmit = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task</DialogTitle>
        </DialogHeader>
        <TaskForm handleSubmit={handleSubmit} afterSubmit={afterSubmit} />
      </DialogContent>
    </Dialog>
  );
}
