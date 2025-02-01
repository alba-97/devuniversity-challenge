import mongoose, { Schema, Document, Types } from "mongoose";

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

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  user: Types.ObjectId;
  parent?: Types.ObjectId;
  subtasks?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Task title must be at least 3 characters long"],
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Task description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.LOW,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must belong to a user"],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      nullable: true,
    },
    subtasks: [
      {
        type: Types.ObjectId,
        ref: 'Task'
      },
    ],
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
