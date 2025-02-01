"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTranslationReady } from "@/hooks/useTranslationReady";
import { useLanguageEffect } from "@/hooks/useLanguageEffect";
import {
  Task,
  TaskCreateDTO,
  TaskPriority,
  TaskStatus,
} from "@/interfaces/task";
import { TaskService } from "@/services/taskService";
import TaskCreationForm from "@/components/dashboard/TaskCreationForm";
import TaskContainer from "@/components/dashboard/TaskContainer";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/Header";
import Logout from "@/components/dashboard/Logout";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
  const { t } = useTranslation("common");
  const isTranslationReady = useTranslationReady();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<TaskCreateDTO>({
    title: "",
    description: "",
    priority: TaskPriority.LOW,
    status: TaskStatus.PENDING,
  });
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [isLogouting, setIsLogouting] = useState(false);

  useLanguageEffect();

  useEffect(() => {
    if (!isTranslationReady) return;

    const fetchTasks = async () => {
      try {
        const fetchedTasks = await TaskService.getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasks();
  }, [isTranslationReady]);

  if (!isTranslationReady) {
    return <div>Loading...</div>;
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdTask = await TaskService.createTask(newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: "",
        description: "",
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING,
      });
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
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
    } finally {
      setIsLogouting(false);
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div
      className={`
        container mx-auto px-4 py-8 
        bg-gray-50 dark:bg-gray-900 
        text-gray-900 dark:text-gray-100
        min-h-screen transition-colors duration-300 ease-in-out
      `}
    >
      <div className="flex flex-col mt-8 md:flex-row justify-between items-start mb-8">
        <Header
          username={user?.username}
          translations={{
            title: t("dashboard.title"),
            welcome: t("dashboard.welcome"),
          }}
        />
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Logout
            isLogouting={isLogouting}
            handleLogout={handleLogout}
            translations={{
              logout: t("dashboard.logout"),
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            shadow-md rounded-lg p-6 h-[528px] 
            transition-colors duration-300 ease-in-out
          `}
        >
          <TaskCreationForm
            newTask={newTask}
            setNewTask={setNewTask}
            onSubmit={handleCreateTask}
          />
        </div>

        <div>
          <TaskContainer
            tasks={filteredTasks}
            filter={filter}
            setFilter={setFilter}
            onDeleteTask={handleDeleteTask}
            translations={{
              summary: t("taskList.summary"),
              totalTasks: t("dashboard.totalTasks"),
              noTasksFound: t("dashboard.noTasksFound"),
              deleteTask: t("taskList.deleteTask"),
              all: t("taskList.all"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
