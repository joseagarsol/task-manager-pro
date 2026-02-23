import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
//import { login } from "../actions";
import { signIn } from "next-auth/react";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
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
          screen.getByText(/correo electrónico inválido/i),
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
      const loginMock = vi.mocked(signIn).mockResolvedValue({
        error: undefined,
        code: undefined,
        status: 200,
        ok: true,
        url: "/",
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
        expect(loginMock).toHaveBeenCalledWith("credentials", {
          email: "test@test.com",
          password: "password",
          redirect: false,
        });
      });
    });

    it("Should show error message when login fails", async () => {
      vi.mocked(signIn).mockResolvedValue({
        error: "Datos inválidos",
        code: undefined,
        status: 401,
        ok: false,
        url: null,
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
      vi.mocked(signIn).mockResolvedValue({
        error: undefined,
        code: undefined,
        status: 200,
        ok: true,
        url: "/",
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
