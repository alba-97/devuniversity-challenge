import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import * as nextNavigation from "next/navigation";

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

describe("LoginPage", () => {
  beforeEach(() => {
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("renders a heading", () => {
    render(<LoginPage />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toBeInTheDocument();
  });
});
