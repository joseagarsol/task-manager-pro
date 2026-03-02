import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileForm from "./ProfileForm";
import { updateProfile } from "../action";
import { useSession } from "next-auth/react";

vi.mock("../action", () => ({
  updateProfile: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

describe("ProfileForm", () => {
  const mockUpdate = vi.fn();
  const mockUser = {
    name: "Juan Pérez",
    email: "juan@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSession).mockReturnValue({
      update: mockUpdate,
      data: {
        user: mockUser,
        expires: "2026-12-31T23:59:59.999Z",
      },
      status: "authenticated",
    });
  });

  it("should render fields with correct initial values", () => {
    render(<ProfileForm user={mockUser} />);

    const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(
      /correo electrónico/i,
    ) as HTMLInputElement;

    expect(nameInput.value).toBe(mockUser.name);
    expect(emailInput.value).toBe(mockUser.email);
    expect(emailInput).toBeDisabled();
  });

  it("should show validation error if name is empty", async () => {
    render(<ProfileForm user={mockUser} />);

    const nameInput = screen.getByLabelText(/nombre/i);
    fireEvent.change(nameInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar cambios/i,
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/el nombre es requerido/i),
    ).toBeInTheDocument();
  });

  it("should call updateProfile and sync session when submitting valid data", async () => {
    vi.mocked(updateProfile).mockResolvedValue({ success: true });

    render(<ProfileForm user={mockUser} />);

    const nameInput = screen.getByLabelText(/nombre/i);
    fireEvent.change(nameInput, { target: { value: "Nuevo Nombre" } });

    const submitButton = screen.getByRole("button", {
      name: /guardar cambios/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        name: "Nuevo Nombre",
        email: mockUser.email,
      });
      expect(mockUpdate).toHaveBeenCalledWith({ name: "Nuevo Nombre" });
    });
  });

  it("should show server error if action fails", async () => {
    const errorMessage = "Error de conexión con la base de datos";
    vi.mocked(updateProfile).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    render(<ProfileForm user={mockUser} />);

    const submitButton = screen.getByRole("button", {
      name: /guardar cambios/i,
    });
    fireEvent.click(submitButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
