import { TaskStatus } from "@/interfaces";
import React from "react";

interface IFilterButtons {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<TaskStatus | "all">>;
  translations: { all: string };
}

const FilterButtons = ({ filter, setFilter, translations }: IFilterButtons) => {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-5 whitespace-nowrap">
      {["all", ...Object.values(TaskStatus)].map((status: string) => (
        <button
          key={status}
          onClick={() => setFilter(status as TaskStatus | "all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === status
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {status === "all" ? translations.all : status}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
