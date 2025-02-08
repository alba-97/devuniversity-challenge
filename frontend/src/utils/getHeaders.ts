"use server";

import { cookies } from "next/headers";

export default async () => {
  const token = cookies().get("token")?.value;
  return { headers: { authorization: `Bearer ${token}` } };
};
