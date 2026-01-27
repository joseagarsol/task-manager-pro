import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTaskForm } from "./useTaskForm";

describe("useTaskForm hook", () => {
  it("should initialize with empty values when no task is provided", () => {
    const { result } = renderHook(() => useTaskForm(undefined));

    expect(result.current.createdAt).toBeUndefined();
    expect(result.current.estimatedAt).toBeUndefined();
    expect(result.current.errors).toBeUndefined();
  });

  it("Should update errors when validateField is called with invalid data", () => {
    const { result } = renderHook(() => useTaskForm(undefined));

    act(() => {
      result.current.validateField("title", "");
    });

    expect(result.current.errors?.title).toBeDefined();
    expect(result.current.errors?.title?.[0]).toBe("El título es obligatorio");
  });

  it("Should return null and set errors if requred dates are missing during submit", () => {
    const { result } = renderHook(() => useTaskForm(undefined));

    const form = document.createElement("form");

    const titleInput = document.createElement("input");
    titleInput.name = "Title";
    titleInput.value = "Título válido";
    form.appendChild(titleInput);

    const descriptionInput = document.createElement("input");
    descriptionInput.name = "Description";
    descriptionInput.value = "Descripción válida";
    form.appendChild(descriptionInput);

    const mockEvent = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as React.FormEvent<HTMLFormElement>;

    let taskResult;
    act(() => {
      taskResult = result.current.validateForm(mockEvent);
    });

    expect(taskResult).toBeNull();
    expect(result.current.errors?.createdAt).toBeDefined();
    expect(result.current.errors?.createdAt?.[0]).toMatch(/obligatoria/i);
  });
  it("should initialize with existing data when a task is provided (Edit Mode)", () => {
    const existingTask = {
      id: "1",
      title: "Tarea Existente",
      description: "Descripción",
      status: "In Progress",
      priority: "High",
      createdAt: new Date("2025-01-01"),
      estimatedAt: new Date("2025-01-05"),
    } as const;

    const { result } = renderHook(() => useTaskForm(existingTask));
    expect(result.current.createdAt).toEqual(existingTask.createdAt);
    expect(result.current.estimatedAt).toEqual(existingTask.estimatedAt);

    expect(result.current.errors).toBeUndefined();
  });
});
