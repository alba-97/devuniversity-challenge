import React from "react";

interface INoTasksFound {
  translations: { noTasksFound: string };
}

const NoTasksFound = ({ translations }: INoTasksFound) => {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <p>{translations.noTasksFound}</p>
    </div>
  );
};

export default NoTasksFound;
