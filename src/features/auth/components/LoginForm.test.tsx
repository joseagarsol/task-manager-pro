import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { login } from "../actions";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/features/auth/actions", () => ({
  login: vi.fn(),
}));

describe("LoginForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Input validation", () => {
    it("Should see validation error messages when inputs are empty", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "" } });
      fireEvent.change(passwordInput, { target: { value: "" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/el correo electrónico es requerido/i),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/la contraseña debe tener al menos 6 caracteres/i),
        ).toBeInTheDocument();
      });
    });

    it("Should see validation error messages when email is invalid", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/correo electrónico inválido/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Login action", () => {
    it("Should call login action with email and password", async () => {
      const loginMock = vi.mocked(login).mockResolvedValue({
        success: true,
        user: { id: "1", name: "Test", email: "test@test.com" },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(loginMock).toHaveBeenCalledTimes(1);
        expect(loginMock).toHaveBeenCalledWith({
          email: "test@test.com",
          password: "password",
        });
      });
    });

    it("Should show error message when login fails", async () => {
      vi.mocked(login).mockResolvedValue({
        success: false,
        error: "Datos inválidos",
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/datos inválidos/i)).toBeInTheDocument();
      });
    });

    it("Should redirect to home page when login is successful", async () => {
      vi.mocked(login).mockResolvedValue({
        success: true,
        user: { id: "1", name: "Test", email: "test@test.com" },
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });
  });
});
