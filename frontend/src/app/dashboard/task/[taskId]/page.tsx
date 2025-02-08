import React from "react";
import getTaskById from "@/api/getTaskById";
import getCurrentUser from "@/api/getCurrentUser";
import TaskDetail from "@/components/TaskDetail";

interface ITaskDetailPageProps {
  params: { taskId: string };
}

export default async function TaskDetailPage({ params }: ITaskDetailPageProps) {
  const task = await getTaskById(params.taskId);
  const user = await getCurrentUser();

  return <TaskDetail task={task} user={user} />;
}
