import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "../page";
import getTasks from "@/api/getTasks";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/components/Dashboard";
import { TaskStatus } from "@/interfaces";

jest.mock("@/api/getTasks", () => jest.fn());
jest.mock("@/components/ProtectedRoute", () => ({
  ProtectedRoute: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock("@/components/Dashboard", () =>
  jest.fn(() => <div data-testid="dashboard-component">Dashboard</div>)
);

describe("DashboardPage", () => {
  const mockTasks = [
    { id: "1", title: "Task 1", status: "TODO" },
    { id: "2", title: "Task 2", status: "IN_PROGRESS" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the ProtectedRoute component", async () => {
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(await DashboardPage({ searchParams: {} }));

    expect(ProtectedRoute).toHaveBeenCalled();
  });

  it("passes tasks and search params to Dashboard component", async () => {
    const searchParams = { status: "TODO" as TaskStatus };
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(await DashboardPage({ searchParams }));

    expect(Dashboard).toHaveBeenCalledWith(
      expect.objectContaining({
        tasks: mockTasks,
        params: searchParams,
      }),
      {}
    );
  });

  it("handles empty search params", async () => {
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(await DashboardPage({}));

    expect(getTasks).toHaveBeenCalledWith({});
  });

  it("renders the Dashboard component", async () => {
    (getTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(await DashboardPage({ searchParams: {} }));

    const dashboardComponent = screen.getByTestId("dashboard-component");
    expect(dashboardComponent).toBeInTheDocument();
  });
});
