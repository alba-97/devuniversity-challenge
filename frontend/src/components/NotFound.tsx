import React from "react";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
      <p className="text-lg text-gray-600 mt-4">
        The page you are looking for doesn't exist.
      </p>
    </div>
  );
};

export default NotFound;
