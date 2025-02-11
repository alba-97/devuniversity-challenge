import { useState } from "react";
import { useTranslation } from "next-i18next";
import { TaskCreateDTO, TaskPriority, TaskStatus } from "@/interfaces/task";
import { Spinner } from "./Spinner";

interface TaskCreationFormProps {
  newTask: TaskCreateDTO;
  setNewTask: React.Dispatch<React.SetStateAction<TaskCreateDTO>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function TaskCreationForm({
  newTask,
  setNewTask,
  onSubmit,
}: TaskCreationFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
        {t("taskCreation.title")}
      </h2>

      <form
        onSubmit={(e) => {
          setLoading(true);
          onSubmit(e);
          setLoading(false);
        }}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("taskCreation.taskTitle")}
          </label>
          <input
            id="task-title"
            type="text"
            placeholder={t("taskCreation.taskTitle")}
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("taskCreation.description")}
          </label>
          <textarea
            id="task-description"
            placeholder={t("taskCreation.description")}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t("taskCreation.priority")}
            </label>
            <select
              id="priority"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value as TaskPriority,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(TaskPriority).map((priority) => (
                <option
                  key={priority}
                  value={priority}
                  className="bg-white dark:bg-gray-800"
                >
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {t("taskCreation.status")}
            </label>
            <select
              id="status"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  status: e.target.value as TaskStatus,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(TaskStatus).map((status) => (
                <option
                  key={status}
                  value={status}
                  className="bg-white dark:bg-gray-800"
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md 
          hover:bg-blue-700 dark:hover:bg-blue-500 
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? (
            <Spinner className="w-5 h-5 text-white" />
          ) : (
            t("taskCreation.createButton")
          )}
        </button>
      </form>
    </div>
  );
}
