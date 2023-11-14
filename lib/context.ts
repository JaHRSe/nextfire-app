import { createContext } from "react";
import { User } from "firebase/auth";

interface loginId {
  user: User | null;
  username: string | null;
}
export const userContext = createContext<Partial<loginId>>({
  user: null,
  username: null,
});
