import api from "./api";
import {
  Task,
  TaskCreateDTO,
  TaskUpdateDTO,
  TaskStatus,
  TaskPriority,
} from "@/interfaces/task";

export interface TaskFilterOptions {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  tags?: string[];
  estimatedHoursMin?: number;
  estimatedHoursMax?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "estimatedHours";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const TaskService = {
  async getTasks(filters?: TaskFilterOptions): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>("/tasks", {
        params: filters,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to fetch tasks");
    }
  },

  async getTaskById(taskId: string): Promise<Task> {
    try {
      const response = await api.get<Task>(`/tasks/${taskId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to fetch task");
    }
  },

  async createTask(taskData: TaskCreateDTO): Promise<Task> {
    try {
      const response = await api.post<Task>("/tasks", taskData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to create task");
    }
  },

  async updateTask(taskId: string, taskData: TaskUpdateDTO): Promise<Task> {
    try {
      const response = await api.put<Task>(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to update task");
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to delete task");
    }
  },

  async addSubtask(
    taskId: string,
    subtaskData: { title: string }
  ): Promise<Task> {
    const response = await api.post<Task>(
      `/tasks/${taskId}/subtasks`,
      subtaskData
    );
    return response.data;
  },

  async updateSubtask(
    taskId: string,
    subtaskId: string,
    subtaskData: { title?: string; completed?: boolean }
  ): Promise<Task> {
    try {
      const response = await api.put<Task>(
        `/tasks/${taskId}/subtasks/${subtaskId}`,
        subtaskData
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to update subtask");
    }
  },

  async createSubtask(taskId: string, subtaskData: TaskCreateDTO): Promise<Task> {
    try {
      const response = await api.post<Task>(`/tasks/${taskId}/subtask`, subtaskData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to create subtask");
    }
  },

  async addTaskDependency(
    taskId: string,
    dependencyData: {
      dependentTaskId: string;
      type: "BLOCKS" | "DEPENDS_ON";
    }
  ): Promise<Task> {
    try {
      const response = await api.post<Task>(
        `/tasks/${taskId}/dependencies`,
        dependencyData
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to add task dependency");
    }
  },

  async getTaskAnalytics(): Promise<{
    totalTasks: number;
    tasksByStatus: Record<TaskStatus, number>;
    tasksByPriority: Record<TaskPriority, number>;
  }> {
    try {
      const response = await api.get("/tasks/analytics");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || new Error("Failed to fetch task analytics");
    }
  },
};
