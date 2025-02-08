import { User } from "@/interfaces";
import getHeaders from "@/utils/getHeaders";
import axios from "axios";

export default async (): Promise<User | null> => {
  try {
    const headers = await getHeaders();
    const { data } = await axios.get<User>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`,
      headers
    );
    return data;
  } catch (err) {
    return null;
  }
};
