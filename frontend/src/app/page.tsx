"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Todo List App
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your tasks efficiently
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link href="/login" className="btn btn-primary w-full">
            Login
          </Link>

          <Link href="/register" className="btn btn-secondary w-full">
            Register
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Todo List App. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
