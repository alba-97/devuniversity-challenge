"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { TaskService } from "@/services/taskService";
import { Task, TaskStatus, TaskPriority } from "@/interfaces/task";

export default function TaskDetailPage() {
  const { t } = useTranslation("common");
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!params?.taskId || typeof params.taskId !== "string") {
          throw new Error("Invalid task ID");
        }

        const fetchedTask = await TaskService.getTaskById(params.taskId);
        setTask(fetchedTask);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch task");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [params?.taskId]);

  const handleUpdateStatus = async (newStatus: TaskStatus) => {
    if (!task) return;

    try {
      const updatedTask = await TaskService.updateTask(task._id, {
        status: newStatus,
      });
      setTask(updatedTask);
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const handleUpdatePriority = async (newPriority: TaskPriority) => {
    if (!task) return;

    try {
      const updatedTask = await TaskService.updateTask(task._id, {
        priority: newPriority,
      });
      setTask(updatedTask);
    } catch (err) {
      console.error("Failed to update task priority", err);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      await TaskService.deleteTask(task._id);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  if (isLoading) {
    return (
      <div data-testid="task-loading" className="text-center mt-10">
        {t("common.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500" data-testid="task-error">
        {error}
        <button
          onClick={() => router.push("/dashboard")}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {t("task.backToDashboard")}
        </button>
      </div>
    );
  }

  if (!task) {
    return <div>{t("task.notFound")}</div>;
  }

  return (
    <div
      className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
      data-testid="task-detail"
    >
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1
            data-testid="task-title"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            {task.title}
          </h1>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {t("taskList.deleteTask")}
          </button>
        </div>

        <div data-testid="task-description" className="mb-4">
          <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("taskCreation.status")}
            </label>
            <select
              value={task.status}
              onChange={(e) => handleUpdateStatus(e.target.value as TaskStatus)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-100"
              data-testid="task-status"
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("task.priority")}
            </label>
            <select
              value={task.priority}
              onChange={(e) =>
                handleUpdatePriority(e.target.value as TaskPriority)
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-gray-100"
            >
              {Object.values(TaskPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>
            {t("task.createdAt")}: {new Date(task.createdAt).toLocaleString()}
          </p>
          {task.updatedAt && (
            <p>
              {t("task.updatedAt")}: {new Date(task.updatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {t("task.backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}
