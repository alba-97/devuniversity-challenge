import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { TaskService } from "@/services/taskService";
import { Task, TaskPriority, TaskStatus } from "@/interfaces/task";
import { User } from "@/interfaces/auth";
import TaskDetailPage from "@/app/dashboard/task/[taskId]/page";

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
    getTaskById: jest.fn(),
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
  usePathname: jest.fn(() => "/task/1"),
  useParams: jest.fn(() => ({ taskId: "1" })),
}));

describe("TaskDetailPage", () => {
  const mockUser: User = {
    id: "1",
    username: "testuser",
    email: "test@example.com",
  };

  const mockTask: Task = {
    _id: "1",
    title: "Test Task",
    description: "Test Description",
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser.id,
    subtasks: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (TaskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
  });

  it("renders task detail page when task is fetched successfully", async () => {
    await act(async () => {
      render(<TaskDetailPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("task-title")).toBeInTheDocument();
      expect(screen.getByTestId("task-description")).toBeInTheDocument();
      expect(screen.getByTestId("task-status")).toBeInTheDocument();
    });
  });

  it("handles task fetching error", async () => {
    (TaskService.getTaskById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch task")
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      render(<TaskDetailPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("task-error")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("passes correct task data to components", async () => {
    await act(async () => {
      render(<TaskDetailPage />);
    });

    await waitFor(() => {
      expect(TaskService.getTaskById).toHaveBeenCalledWith("1");
    });
  });

  it("renders loading state initially", async () => {
    const slowTaskFetch = new Promise<Task>(() => {});
    (TaskService.getTaskById as jest.Mock).mockImplementation(
      () => slowTaskFetch
    );

    await act(async () => {
      render(<TaskDetailPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("task-loading")).toBeInTheDocument();
    });
  });
});
