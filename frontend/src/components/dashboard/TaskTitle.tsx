import React from "react";

const TaskTitle = ({ title }: { title: string }) => {
  return (
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
      {title}
    </h3>
  );
};

export default TaskTitle;
