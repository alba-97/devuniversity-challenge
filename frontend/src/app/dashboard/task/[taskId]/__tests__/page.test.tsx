import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import TaskDetailPage from "../page";
import { TaskService } from "@/services/taskService";
import { Task, TaskPriority, TaskStatus } from "@/interfaces/task";
import { User } from "@/interfaces/auth";

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
    updateTask: jest.fn(),
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
  useParams: jest.fn(() => ({ taskId: "1" })),
  usePathname: jest.fn(() => "/task/1"),
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
    dependencies: [],
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock task service
    (TaskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
    (TaskService.updateTask as jest.Mock).mockResolvedValue({
      ...mockTask,
      status: TaskStatus.IN_PROGRESS,
    });
  });

  it("renders task detail page when task is fetched successfully", async () => {
    await act(async () => {
      render(<TaskDetailPage />);
    });

    // Check if task details are rendered
    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  it("handles task fetching error", async () => {
    // Mock error scenario
    (TaskService.getTaskById as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch task")
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      render(<TaskDetailPage />);
    });

    // Check if error is logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("renders loading state initially", async () => {
    // Create a promise that doesn't resolve immediately to simulate loading
    const slowTaskFetch = new Promise<Task>(() => {});
    (TaskService.getTaskById as jest.Mock).mockImplementation(
      () => slowTaskFetch
    );

    await act(async () => {
      render(<TaskDetailPage />);
    });

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  it("passes correct task data to components", async () => {
    await act(async () => {
      render(<TaskDetailPage />);
    });

    // Verify task service was called with correct taskId
    await waitFor(() => {
      expect(TaskService.getTaskById).toHaveBeenCalledWith("1");
    });
  });
});
