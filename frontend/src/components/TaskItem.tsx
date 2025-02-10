import { Task, TaskStatus } from "@/interfaces";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import TaskList from "./TaskList";

interface ITaskItemProps {
  task: Task;
  onDeleteTask?: (taskId: string) => Promise<void>;
  depth?: number;
}

export default ({
  task,
  onDeleteTask,
  depth = 0,
}: ITaskItemProps & { depth?: number }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-4">
      <div
        key={task._id}
        className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
        style={{ marginLeft: `${depth * 40}px` }}
      >
        <div className="flex-grow pr-4">
          <Link href={`/dashboard/task/${task._id}`}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {task.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {task.description}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.status === TaskStatus.DONE
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
            }`}
          >
            {task.status}
          </span>
          {onDeleteTask && (
            <button
              onClick={() => onDeleteTask(task._id)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              aria-label={t("taskCreation.deleteTask")}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <TaskList
          tasks={task.subtasks}
          onDeleteTask={onDeleteTask}
          depth={depth + 1}
        />
      )}
    </div>
  );
};
