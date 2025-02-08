import getHeaders from "@/utils/getHeaders";
import axios from "axios";

export default async (taskId: string): Promise<void> => {
  const headers = await getHeaders();
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
    headers
  );
};
