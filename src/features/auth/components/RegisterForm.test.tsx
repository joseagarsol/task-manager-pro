import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
import { register } from "../actions";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/features/auth/actions", () => ({
  register: vi.fn(),
}));

describe("RegisterForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Input validation", () => {
    it("Should see validation error messages when input are empty", async () => {
      render(<RegisterForm />);

      const nameInput = screen.getByLabelText(/nombre/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput =
        screen.getByLabelText(/confirmar contraseña/i);
      const submitButton = screen.getByRole("button", { name: "Register" });

      fireEvent.change(nameInput, { target: { value: "" } });
      fireEvent.change(emailInput, { target: { value: "" } });
      fireEvent.change(passwordInput, { target: { value: "" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
        expect(
          screen.getByText(/correo electrónico inválido/i),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/la contraseña debe tener al menos 8 caracteres/i),
        ).toBeInTheDocument();
      });
    });

    it("Should see validation error when confirm password does not match password", async () => {
      render(<RegisterForm />);

      const nameInput = screen.getByLabelText(/nombre/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput =
        screen.getByLabelText(/confirmar contraseña/i);
      const submitButton = screen.getByRole("button", { name: "Register" });

      fireEvent.change(nameInput, { target: { value: "Test" } });
      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "wrong" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/las contraseñas no coinciden/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Register action", () => {
    it("Should call register action with name, email, password and confirm password", async () => {
      const registerMock = vi.mocked(register).mockResolvedValue({
        success: true,
        user: { id: "1", name: "Test", email: "test@test.com" },
      });

      render(<RegisterForm />);

      const nameInput = screen.getByLabelText(/nombre/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput =
        screen.getByLabelText(/confirmar contraseña/i);
      const submitButton = screen.getByRole("button", { name: "Register" });

      fireEvent.change(nameInput, { target: { value: "Test" } });
      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1234@" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "Password1234@" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(registerMock).toHaveBeenCalledTimes(1);
        expect(registerMock).toHaveBeenCalledWith({
          name: "Test",
          email: "test@test.com",
          password: "Password1234@",
          confirmPassword: "Password1234@",
        });
      });
    });
    it("SHould redirect to login page when register is successful", async () => {
      vi.mocked(register).mockResolvedValue({
        success: true,
        user: { id: "1", name: "Test", email: "test@test.com" },
      });

      render(<RegisterForm />);

      const nameInput = screen.getByLabelText(/nombre/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput =
        screen.getByLabelText(/confirmar contraseña/i);
      const submitButton = screen.getByRole("button", { name: "Register" });

      fireEvent.change(nameInput, { target: { value: "Test" } });
      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password1234@" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "Password1234@" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      });
    });
  });
});
