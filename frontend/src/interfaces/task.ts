export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in progress",
  PENDING = "pending",
  BLOCKED = "blocked",
  REVIEW = "review",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDependency {
  id: string;
  dependentTaskId: string;
  blockedByTaskId: string;
  type: "BLOCKS" | "DEPENDS_ON";
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  user: string;
  subtasks: Subtask[];
  dependencies: TaskDependency[];
  estimatedHours?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreateDTO {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  subtasks?: Omit<Subtask, "id" | "createdAt" | "updatedAt">[];
  dependencies?: Omit<TaskDependency, "id">[];
  estimatedHours?: number;
  tags?: string[];
}

export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  subtasks?: Subtask[];
  dependencies?: TaskDependency[];
  estimatedHours?: number;
  tags?: string[];
}
