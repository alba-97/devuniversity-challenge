import { Task } from "@/interfaces";
import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

interface IDeleteTaskProps {
  onDeleteTask?: (taskId: string) => Promise<void>;
  task: Task;
  translations: {
    deleteTask: string;
  };
}

const DeleteTask = ({ onDeleteTask, task, translations }: IDeleteTaskProps) => {
  return (
    onDeleteTask && (
      <button
        onClick={() => onDeleteTask(task._id)}
        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        aria-label={translations.deleteTask}
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    )
  );
};

export default DeleteTask;
