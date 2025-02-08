import { Task, TaskCreateDTO } from "@/interfaces";
import getHeaders from "@/utils/getHeaders";
import axios from "axios";

export default async (taskData: TaskCreateDTO): Promise<Task> => {
  const headers = await getHeaders();
  const { data } = await axios.post<Task>(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
    taskData,
    headers
  );
  return data;
};
