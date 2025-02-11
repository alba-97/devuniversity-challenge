"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTranslationReady } from "@/hooks/useTranslationReady";
import { useLanguageEffect } from "@/hooks/useLanguageEffect";
import {
  Task,
  TaskCreateDTO,
  TaskPriority,
  TaskStatus,
} from "@/interfaces/task";
import TaskCreationForm from "@/components/TaskCreationForm";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Spinner } from "@/components/Spinner";
import TaskList from "@/components/TaskList";
import createTask from "@/api/createTask";
import deleteTask from "@/api/deleteTask";
import logout from "@/api/logout";
import { TaskFilterOptions } from "@/services/taskService";
import { useUser } from "@/context/UserContext";

interface IDashboardProps {
  tasks: Task[];
  params: TaskFilterOptions;
}

export default function Dashboard({ tasks, params }: IDashboardProps) {
  const router = useRouter();
  const user = useUser();

  const { t } = useTranslation();
  const [newTask, setNewTask] = useState<TaskCreateDTO>({
    title: "",
    description: "",
    priority: TaskPriority.LOW,
    status: TaskStatus.PENDING,
  });
  const [isLogouting, setIsLogouting] = useState<boolean>(false);

  const isTranslationReady = useTranslationReady();
  useLanguageEffect();

  if (!isTranslationReady) {
    return (
      <div className="flex justify-center items-center w-full mt-20">
        <Spinner />
      </div>
    );
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setNewTask({
        title: "",
        description: "",
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleLogout = async () => {
    setIsLogouting(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      setIsLogouting(false);
    }
  };

  const createQueryString = (key: string, value: string) => {
    const newParams = { ...params, [key]: value };
    return (
      "?" +
      Object.keys(newParams)
        .map((key) => {
          return `${key}=${newParams[key as keyof TaskFilterOptions]}`;
        })
        .join("&")
    );
  };

  const removeQueryString = (key: string) => {
    const newParams = { ...params };
    delete newParams[key as keyof TaskFilterOptions];
    return (
      "?" +
      Object.keys(newParams)
        .map((key) => {
          return `${key}=${newParams[key as keyof TaskFilterOptions]}`;
        })
        .join("&")
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300 ease-in-out">
      <div className="flex flex-col mt-8 md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {t("dashboard.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("dashboard.welcome")}, {user?.username || "User"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            onClick={handleLogout}
            disabled={isLogouting}
            data-testid="logout-button"
          >
            {isLogouting ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              t("dashboard.logout")
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-md rounded-lg p-6 h-[528px] transition-colors duration-300 ease-in-out">
          <TaskCreationForm
            newTask={newTask}
            setNewTask={setNewTask}
            onSubmit={handleCreateTask}
          />
        </div>

        <div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
              {t("taskList.summary")}
            </h2>

            <div className="flex space-x-2 mb-6 overflow-x-auto pb-5 whitespace-nowrap">
              {["all", ...Object.values(TaskStatus)].map((status: string) => (
                <button
                  key={status}
                  onClick={() => {
                    if (status === "all")
                      router.push(removeQueryString("status"));
                    else router.push(createQueryString("status", status));
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    params.status === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {status === "all" ? t("taskList.all") : status}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("dashboard.totalTasks")}:{" "}
                <span className="font-semibold">{tasks.length}</span>
              </p>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>{t("dashboard.noTasksFound")}</p>
              </div>
            ) : (
              <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
