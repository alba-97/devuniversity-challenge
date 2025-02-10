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
  document.cookie = `token=${data.token}; Max-Age=3600; Secure; SameSite=Lax`;
  return data;
};
