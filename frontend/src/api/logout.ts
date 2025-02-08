"use server";

import { cookies } from "next/headers";

export default async (): Promise<void> => {
  await cookies().delete("token");
};
