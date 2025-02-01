import React from "react";

interface IHeaderProps {
  username?: string;
  translations: {
    title: string;
    welcome: string;
  };
}

const Header = ({ username, translations }: IHeaderProps) => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {translations.title}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400">
        {translations.welcome}, {username || "User"}
      </p>
    </div>
  );
};

export default Header;
