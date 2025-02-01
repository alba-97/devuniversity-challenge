import { TaskStatus as TaskStatusEnum } from "@/interfaces";
import React from "react";

interface ITaskStatusProps {
  status: TaskStatusEnum;
  className?: string;
}

const TaskStatus = ({ status, className = "" }: ITaskStatusProps) => {
  const statusClassName =
    status === TaskStatusEnum.DONE
      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusClassName} ${className}`}
    >
      {status}
    </span>
  );
};

export default TaskStatus;
