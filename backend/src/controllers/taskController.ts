import { Request, Response, NextFunction } from "express";
import Task from "../models/Task";
import { TaskStatus, TaskPriority } from "../models/Task";

interface TaskOptions {
  user?: string;
  status?: TaskStatus;
}

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const options: TaskOptions = {
      user: userId,
    };

    if (status) options.status = status as TaskStatus;

    const tasks = await Task.find(options);

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.findOne({ _id: id, user: userId }).populate(
      "subtasks"
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, priority, parent } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = new Task({
      title,
      description,
      status: status || TaskStatus.PENDING,
      priority: priority || TaskPriority.LOW,
      user: userId,
      parent: parent || null,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, parent } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const task = await Task.findOne({ _id: id, user: userId });

    if (!task)
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (parent !== undefined) task.parent = parent;

    task.updatedAt = new Date();
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot delete another user's task" });
    }

    await Task.deleteMany({ parent: id });

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task and its subtasks deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const createSubtask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parentTask = await Task.findOne({ _id: id, user: userId });

    if (!parentTask) {
      return res
        .status(404)
        .json({ message: "Parent task not found or unauthorized" });
    }

    const subtask = new Task({
      title,
      description,
      status: status || TaskStatus.PENDING,
      priority: priority || TaskPriority.LOW,
      user: userId,
      parent: parentTask._id,
    });

    await subtask.save();

    parentTask.subtasks = parentTask.subtasks || [];
    parentTask.subtasks.push(subtask._id);
    await parentTask.save();

    res.status(201).json(subtask);
  } catch (error) {
    next(error);
  }
};
