import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import DashboardPage from "../page";
import { TaskService } from "@/services/taskService";
import { User } from "@/interfaces/auth";
import { Task, TaskPriority, TaskStatus } from "@/interfaces/task";

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      username: "testuser",
      email: "test@example.com",
    },
    logout: jest.fn(),
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

jest.mock("@/services/taskService", () => ({
  TaskService: {
    getTasks: jest.fn(),
  },
}));

jest.mock("react-i18next", () => ({
  __esModule: true,
  ...jest.requireActual("react-i18next"),
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  usePathname: jest.fn(() => "/dashboard"),
}));

jest.mock("@/components/dashboard/TaskCreationForm", () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="task-creation-form">
        <div>Title</div>
        <div>Description</div>
        <div>Priority</div>
      </div>
    ),
  };
});

jest.mock("@/components/dashboard/Logout", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="logout-component">Logout</div>,
  };
});

jest.mock("@/components/ThemeToggle", () => {
  return {
    __esModule: true,
    ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
  };
});

describe("DashboardPage", () => {
  const mockUser: User = {
    id: "1",
    username: "testuser",
    email: "test@example.com",
  };

  const mockTasks: Task[] = [
    {
      _id: "1",
      title: "Test Task 1",
      description: "Description 1",
      priority: TaskPriority.LOW,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: "1",
      subtasks: [],
      dependencies: [],
    },
    {
      _id: "2",
      title: "Test Task 2",
      description: "Description 2",
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: "1",
      subtasks: [],
      dependencies: [],
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock task service
    (TaskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
  });

  it("renders dashboard page when user is authenticated", async () => {
    await act(async () => {
      render(<DashboardPage />);
    });

    // Check if task titles are rendered
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });

  it("renders task creation form", async () => {
    await act(async () => {
      render(<DashboardPage />);
    });

    // Check for task creation form
    await waitFor(() => {
      expect(screen.getByTestId("task-creation-form")).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Priority")).toBeInTheDocument();
    });
  });

  it("handles task fetching error", async () => {
    // Mock error scenario
    (TaskService.getTasks as jest.Mock).mockRejectedValue(
      new Error("Fetch error")
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      render(<DashboardPage />);
    });

    // Check if error is logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch tasks",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("renders logout and theme toggle components", async () => {
    await act(async () => {
      render(<DashboardPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("logout-component")).toBeInTheDocument();
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });
  });
});
