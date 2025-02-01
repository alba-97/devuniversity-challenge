import React from "react";
import { Spinner } from "../Spinner";
import { useTranslation } from "react-i18next";

interface ILogoutProps {
  isLogouting: boolean;
  handleLogout: () => void;
  translations: {
    logout: string;
  };
}

const Logout = ({ isLogouting, handleLogout }: ILogoutProps) => {
  const { t } = useTranslation("common");
  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
      onClick={handleLogout}
      disabled={isLogouting}
    >
      {isLogouting ? (
        <Spinner className="w-5 h-5 text-white" />
      ) : (
        t("dashboard.logout")
      )}
    </button>
  );
};

export default Logout;
