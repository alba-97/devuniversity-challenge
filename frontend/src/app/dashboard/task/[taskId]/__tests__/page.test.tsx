import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskPage from "../page";
import getTaskById from "@/api/getTaskById";
import updateTask from "@/api/updateTask";
import deleteTask from "@/api/deleteTask";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTranslationReady } from "@/hooks/useTranslationReady";
import { TaskStatus, TaskPriority } from "@/interfaces";

jest.mock("@/api/getTaskById", () => jest.fn());
jest.mock("@/api/updateTask", () => jest.fn());
jest.mock("@/api/deleteTask", () => jest.fn());
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(() => ({ taskId: "test-task-id" })),
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

describe("TaskPage", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  const mockTask = {
    _id: "test-task-id",
    title: "Test Task",
    description: "Test Description",
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [],
  };

  const mockTranslation = {
    t: jest.fn((key) => {
      const translations = {
        "task.title_label": "Title",
        "task.description_label": "Description",
        "task.status_label": "Status",
        "task.created_at_label": "Created At",
        "task.updated_at_label": "Updated At",
        "taskList.deleteTask": "Delete Task",
        "task.backToDashboard": "Back to Dashboard",
        "task.childTasks": "Child Tasks",
        "taskCreation.status": "Status",
        "taskCreation.priority": "Priority",
        "task.createdAt": "Created At",
        "task.updatedAt": "Updated At",
        "task.edit": "Edit",
        "task.save": "Save",
        "task.cancel": "Cancel",
      };
      return translations[key as keyof typeof translations] || key;
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useTranslation as jest.Mock).mockReturnValue(mockTranslation);
    (useTranslationReady as jest.Mock).mockReturnValue(true);
    (getTaskById as jest.Mock).mockResolvedValue(mockTask);
  });

  it("renders loading state when translations are not ready", async () => {
    (useTranslationReady as jest.Mock).mockReturnValue(false);

    render(await TaskPage({ params: { taskId: "test-task-id" } }));

    const loadingIndicator = screen.getByTestId("loading-indicator");
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("renders task details when translations are ready", async () => {
    render(await TaskPage({ params: { taskId: "test-task-id" } }));

    expect(getTaskById).toHaveBeenCalledWith("test-task-id");
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("allows updating task status", async () => {
    (updateTask as jest.Mock).mockResolvedValue({
      ...mockTask,
      status: TaskStatus.DONE,
    });

    render(await TaskPage({ params: { taskId: "test-task-id" } }));

    const statusSelect = screen.getByTestId("task-status");
    fireEvent.change(statusSelect, { target: { value: TaskStatus.DONE } });

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith("test-task-id", {
        status: TaskStatus.DONE,
      });
    });
  });

  it("allows deleting a task", async () => {
    (deleteTask as jest.Mock).mockResolvedValue({});

    render(await TaskPage({ params: { taskId: "test-task-id" } }));

    const deleteButton = screen.getByText("Delete Task");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith("test-task-id");
      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("handles task deletion failure", async () => {
    const mockError = new Error("Deletion failed");
    (deleteTask as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(await TaskPage({ params: { taskId: "test-task-id" } }));

    const deleteButton = screen.getByText("Delete Task");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith("test-task-id");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to delete task",
        mockError
      );
    });

    consoleSpy.mockRestore();
  });
});
