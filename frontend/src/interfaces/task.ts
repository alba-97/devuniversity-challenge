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

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  user: string;
  subtasks: Task[];
  parent?: Task;
  estimatedHours?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateDTO {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  parent?: string;
  subtasks?: Omit<TaskCreateDTO, "parent">[];
}

export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  parent?: string | null;
  subtasks?: Omit<TaskCreateDTO, "parent">[];
}
