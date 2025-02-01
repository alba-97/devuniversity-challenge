import React from "react";

const TaskDescription = ({ description }: { description?: string }) => {
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
      {description}
    </p>
  );
};

export default TaskDescription;
