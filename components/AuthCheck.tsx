import Link from "next/link";
import { useContext } from "react";
import { userContext } from "@/lib/context";

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthCheck(props: AuthCheckProps) {
  const { username } = useContext(userContext);

  return username
    ? props.children
    : props.fallback || <Link href="/enter">You must sign in</Link>;
}
