import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskDialog from "./TaskDialog";

describe("TaskDialog Component", () => {
  it("Should open the dialog when the trigger is clicked", () => {
    const trigger = <button>Abrir</button>;
    render(<TaskDialog trigger={trigger} handleSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /abrir/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /abrir/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
