import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "../page";
import register from "@/api/register";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTranslationReady } from "@/hooks/useTranslationReady";

jest.mock("@/api/register", () => jest.fn());
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));
jest.mock("@/hooks/useTranslationReady", () => ({
  useTranslationReady: jest.fn(),
}));
jest.mock("@/hooks/useLanguageEffect", () => ({
  useLanguageEffect: jest.fn(),
}));

describe("RegisterPage", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  const mockTranslation = {
    t: jest.fn((key) => {
      const translations = {
        "register.errors.registration_failed": "Registration failed",
        "register.errors.unknown": "Unknown error",
        "register.errors.password_mismatch": "Passwords do not match",
        "register.title": "Register",
        "register.username_label": "Username",
        "register.username_placeholder": "Enter your username",
        "register.email_label": "Email",
        "register.email_placeholder": "Enter your email",
        "register.password_label": "Password",
        "register.password_placeholder": "Enter your password",
        "register.confirm_password_label": "Confirm Password",
        "register.confirm_password_placeholder": "Confirm your password",
        "register.registering_button": "Registering...",
        "register.register_button": "Register",
        "register.login_link": "Already have an account? Login",
        "register.errors.username_required": "Username is required",
        "register.errors.email_required": "Email is required",
        "register.errors.password_required": "Password is required",
        "register.errors.password_too_short": "Password is too short",
      };
      return translations[key as keyof typeof translations] || key;
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
    (useTranslationReady as jest.Mock).mockReturnValue(true);
  });

  it("renders loading state when translations are not ready", () => {
    (useTranslationReady as jest.Mock).mockReturnValue(false);

    render(<RegisterPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders register form when translations are ready", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: "Register" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
  });

  it("handles registration failure with specific error", async () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: "Email already exists" },
      },
      isAxiosError: true,
    };
    (register as jest.Mock).mockRejectedValue(mockError);

    render(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", { name: "Register" });

    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Registration failed")).toBeInTheDocument();
    });
  });

  it("handles unknown registration error", async () => {
    const mockError = new Error("Network error");
    (register as jest.Mock).mockRejectedValue(mockError);

    render(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", { name: "Register" });

    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText((content, element) => {
        return element?.textContent === "Registration failed";
      });
      expect(errorElement).toBeInTheDocument();
    });
  });

  it("prevents registration with mismatched passwords", async () => {
    render(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", { name: "Register" });

    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentpassword" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      expect(register).not.toHaveBeenCalled();
    });
  });

  it("disables submit button during registration", async () => {
    (register as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves to keep button disabled

    render(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByRole("button", { name: "Register" });

    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText("Registering...")).toBeInTheDocument();
    });
  });

  it("navigates to login page", () => {
    render(<RegisterPage />);

    const loginLink = screen.getByText("Already have an account? Login");
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
