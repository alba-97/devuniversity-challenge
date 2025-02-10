"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/api/getCurrentUser";
import { User } from "@/interfaces";
import { UserContext } from "@/context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();

  const checkUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    if (!user) router.push("/login");
  };

  useEffect(() => {
    checkUser();
  }, [router]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
