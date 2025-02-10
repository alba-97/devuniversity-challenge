"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Task, TaskStatus, TaskPriority } from "@/interfaces/task";
import getTaskById from "@/api/getTaskById";
import updateTask from "@/api/updateTask";
import deleteTask from "@/api/deleteTask";
import { User } from "@/interfaces";
import NotFound from "./NotFound";
import formatDate from "@/utils/formatDate";
import createSubtask from "@/api/createSubtask";
import { useLanguageEffect } from "@/hooks/useLanguageEffect";
import { useTranslationReady } from "@/hooks/useTranslationReady";
import { Spinner } from "./Spinner";
import { useUser } from "@/context/UserContext";

interface ITaskDetailProps {
  task: Task | null;
}

export default function TaskDetail({ task }: ITaskDetailProps) {
  const router = useRouter();

  if (!task) return <NotFound />;

  const { t } = useTranslation();
  const [isAddingChildTask, setIsAddingChildTask] = useState(false);
  const [childTaskTitle, setChildTaskTitle] = useState("");
  const [childTaskDescription, setChildTaskDescription] = useState("");
  const [childTaskStatus, setChildTaskStatus] = useState<TaskStatus>(
    TaskStatus.TODO
  );
  const [childTaskPriority, setChildTaskPriority] = useState<TaskPriority>(
    TaskPriority.LOW
  );

  const isTranslationReady = useTranslationReady();
  useLanguageEffect();

  if (!isTranslationReady) {
    return (
      <div className="flex justify-center items-center w-full mt-20">
        <Spinner />
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus: TaskStatus) => {
    if (!task) return;

    try {
      await updateTask(task._id, {
        status: newStatus,
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const handleUpdatePriority = async (newPriority: TaskPriority) => {
    if (!task) return;

    try {
      await updateTask(task._id, {
        priority: newPriority,
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update task priority", err);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      await deleteTask(task._id);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleCreateChildTask = async () => {
    if (!task) return;

    try {
      await createSubtask(task._id, {
        title: childTaskTitle,
        description: childTaskDescription,
        status: childTaskStatus,
        priority: childTaskPriority,
      });

      await getTaskById(task._id);
      router.refresh();

      setChildTaskTitle("");
      setChildTaskDescription("");
      setChildTaskStatus(TaskStatus.TODO);
      setChildTaskPriority(TaskPriority.LOW);
      setIsAddingChildTask(false);
    } catch (err) {
      console.error("Failed to create child task", err);
    }
  };

  if (!task) return <div>{t("task.notFound")}</div>;

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
              {t("taskCreation.priority")}
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
            {t("task.createdAt")}: {formatDate(task.createdAt)}
          </p>
          {task.updatedAt && (
            <p>
              {t("task.updatedAt")}: {formatDate(task.updatedAt)}
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

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">{t("task.childTasks")}</h2>

          {task?.subtasks && task.subtasks.length > 0 ? (
            <div className="space-y-2">
              {task.subtasks.map((subtask: Task) => (
                <div
                  key={subtask._id}
                  className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{subtask.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {subtask.description}
                    </p>
                  </div>
                  <span
                    className={`
                    px-2 py-1 rounded text-xs 
                    ${
                      subtask.status === TaskStatus.DONE
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  `}
                  >
                    {subtask.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {t("task.noChildTasks")}
            </p>
          )}

          <button
            onClick={() => setIsAddingChildTask(!isAddingChildTask)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isAddingChildTask
              ? t("task.cancelAddChildTask")
              : t("task.addChildTask")}
          </button>

          {isAddingChildTask && (
            <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("taskCreation.title")}
                </label>
                <input
                  type="text"
                  value={childTaskTitle}
                  onChange={(e) => setChildTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder={t("taskCreation.titlePlaceholder")}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("taskCreation.description")}
                </label>
                <textarea
                  value={childTaskDescription}
                  onChange={(e) => setChildTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  placeholder={t("taskCreation.descriptionPlaceholder")}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("taskCreation.status")}
                  </label>
                  <select
                    value={childTaskStatus}
                    onChange={(e) =>
                      setChildTaskStatus(e.target.value as TaskStatus)
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  >
                    {Object.values(TaskStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("taskCreation.priority")}
                  </label>
                  <select
                    value={childTaskPriority}
                    onChange={(e) =>
                      setChildTaskPriority(e.target.value as TaskPriority)
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                  >
                    {Object.values(TaskPriority).map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateChildTask}
                disabled={!childTaskTitle}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {t("task.createChildTask")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
