import { Request, Response, NextFunction } from "express";
import Task from "../models/Task";
import { TaskStatus, TaskPriority } from "../models/Task";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({ user: userId });

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

    const task = await Task.findOne({ _id: id, user: userId });

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
    const { title, description, status, priority } = req.body;
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
    const { title, description, status, priority } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        updatedAt: new Date(), // Explicitly update timestamp
      },
      {
        new: true,
        runValidators: true,
      }
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

export const deleteTask = async (
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

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden: You cannot delete another user's task" });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
