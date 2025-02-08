import { Task, TaskUpdateDTO } from "@/interfaces";
import getHeaders from "@/utils/getHeaders";
import axios from "axios";

export default async (
  taskId: string,
  taskData: TaskUpdateDTO
): Promise<Task> => {
  const headers = await getHeaders();
  const { data } = await axios.put<Task>(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    taskData,
    headers
  );
  return data;
};
