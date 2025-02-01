import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as nextNavigation from "next/navigation";
import RegisterPage from "../page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn(),
    isLoading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/hooks/useTranslationReady", () => ({
  useTranslationReady: () => true,
}));

jest.mock("@/hooks/useLanguageEffect", () => ({
  useLanguageEffect: jest.fn(),
}));

describe("Register Page", () => {
  beforeEach(() => {
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("renders a heading", () => {
    render(<RegisterPage />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
