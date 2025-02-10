import React from "react";
import getTaskById from "@/api/getTaskById";
import TaskDetail from "@/components/TaskDetail";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface ITaskDetailPageProps {
  params: { taskId: string };
}

export default async function TaskDetailPage({ params }: ITaskDetailPageProps) {
  const task = await getTaskById(params.taskId);

  return (
    <ProtectedRoute>
      <TaskDetail task={task} />
    </ProtectedRoute>
  );
}
