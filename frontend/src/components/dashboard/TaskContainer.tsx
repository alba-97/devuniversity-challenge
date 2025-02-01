import React from "react";
import { Task, TaskPriority, TaskStatus } from "@/interfaces/task";
import FilterButtons from "./FilterButtons";
import TaskCounter from "./TaskCounter";
import NoTasksFound from "./NoTasksFound";
import TaskList from "./TaskList";

interface TaskContainerProps {
  tasks: Task[];
  filter: TaskStatus | "all";
  setFilter: React.Dispatch<React.SetStateAction<TaskStatus | "all">>;
  onDeleteTask?: (taskId: string) => Promise<void>;
  onUpdateStatus?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onUpdatePriority?: (
    taskId: string,
    newPriority: TaskPriority
  ) => Promise<void>;
  translations: {
    deleteTask: string;
    summary: string;
    totalTasks: string;
    noTasksFound: string;
    all: string;
  };
}

export default function TaskContainer({
  tasks,
  filter,
  setFilter,
  onDeleteTask,
  translations,
}: TaskContainerProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
        {translations.summary}
      </h2>

      <FilterButtons
        filter={filter}
        setFilter={setFilter}
        translations={{ all: translations.all }}
      />

      <TaskCounter
        tasks={tasks}
        translations={{
          totalTasks: translations.totalTasks,
        }}
      />

      {tasks.length === 0 ? (
        <NoTasksFound
          translations={{ noTasksFound: translations.noTasksFound }}
        />
      ) : (
        <TaskList
          tasks={tasks}
          translations={{ deleteTask: translations.deleteTask }}
          onDeleteTask={onDeleteTask}
        />
      )}
    </div>
  );
}
