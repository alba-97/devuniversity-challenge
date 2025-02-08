import { Task } from "@/interfaces";
import { TaskFilterOptions } from "@/services/taskService";
import getHeaders from "@/utils/getHeaders";
import axios from "axios";

export default async (filters: TaskFilterOptions = {}) => {
  try {
    const headers = await getHeaders();
    const { data } = await axios.get<Task[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
      {
        params: filters,
        ...headers,
      }
    );
    return data;
  } catch (err) {
    return [];
  }
};
