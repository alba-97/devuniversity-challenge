import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../page";
import login from "@/api/login";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTranslationReady } from "@/hooks/useTranslationReady";

jest.mock("@/api/login", () => jest.fn());
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

describe("LoginPage", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  const mockTranslation = {
    t: jest.fn((key) => {
      const translations = {
        "login.errors.login_failed": "Login failed",
        "login.errors.unknown": "Unknown error",
        "login.title": "Login",
        "login.email_label": "Email",
        "login.password_label": "Password",
        "login.email_placeholder": "Enter your email",
        "login.password_placeholder": "Enter your password",
        "login.signing_in": "Signing in...",
        "login.sign_in": "Sign In",
        "login.create_account": "Create an account",
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

    render(<LoginPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders login form when translations are ready", () => {
    render(<LoginPage />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    (login as jest.Mock).mockResolvedValue({});

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it("handles login failure with 401 error", async () => {
    const mockError = {
      response: { status: 401 },
      isAxiosError: true,
    };
    (login as jest.Mock).mockRejectedValue(mockError);

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Login failed")).toBeInTheDocument();
    });
  });

  it("handles unknown login error", async () => {
    const mockError = new Error("Network error");
    (login as jest.Mock).mockRejectedValue(mockError);

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Unknown error")).toBeInTheDocument();
    });
  });

  it("navigates to register page", () => {
    render(<LoginPage />);

    const registerLink = screen.getByText("Create an account");
    expect(registerLink).toHaveAttribute("href", "/register");
  });
});
