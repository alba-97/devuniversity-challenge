import { Task } from "@/interfaces";
import getHeaders from "@/utils/getHeaders";
import axios from "axios";

export default async (taskId: string): Promise<Task> => {
  const headers = await getHeaders();
  const { data } = await axios.get<Task>(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    headers
  );
  return data;
};
