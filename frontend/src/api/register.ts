import { AuthResponse } from "@/interfaces";
import axios from "axios";

export default async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      username,
      email,
      password,
    },
    { withCredentials: true }
  );
  return data;
};
