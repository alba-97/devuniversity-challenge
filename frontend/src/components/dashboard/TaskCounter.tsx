import { Task } from "@/interfaces";
import React from "react";

interface ITaskCounter {
  tasks: Task[];
  translations: { totalTasks: string };
}

const TaskCounter = ({ tasks, translations }: ITaskCounter) => {
  return (
    <div className="mb-6">
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {translations.totalTasks}:{" "}
        <span className="font-semibold">{tasks.length}</span>
      </p>
    </div>
  );
};

export default TaskCounter;
