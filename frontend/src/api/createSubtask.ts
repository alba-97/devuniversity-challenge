import { Task, TaskCreateDTO } from "@/interfaces";
import getHeaders from "@/utils/getHeaders";
import axios from "axios";

export default async (
  taskId: string,
  subtaskData: TaskCreateDTO
): Promise<Task> => {
  const headers = await getHeaders();
  const response = await axios.post<Task>(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/subtask`,
    subtaskData,
    headers
  );
  return response.data;
};
