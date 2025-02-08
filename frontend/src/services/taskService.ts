import { TaskStatus, TaskPriority } from "@/interfaces/task";

export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority[];
  tags?: string[];
  estimatedHoursMin?: number;
  estimatedHoursMax?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "estimatedHours";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
