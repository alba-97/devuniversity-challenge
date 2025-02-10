import { User } from "@/interfaces";
import { createContext, useContext } from "react";

const UserContext = createContext<User | undefined | null>(null);

export const useUser = () => useContext(UserContext);

export { UserContext };
