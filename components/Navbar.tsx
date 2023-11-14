import Link from "next/link";
import { useContext } from "react";
import { userContext } from "@/lib/context";

export default function Navbar() {
  const { user, username } = useContext(userContext);

  return (
    <nav className="navbar">
      <ul>
        <li className="push-left">
          <Link href={"/"}>
            <button className="btn-blue">Feed</button>
          </Link>
        </li>
        {username && (
          <>
            <li>
              <Link href={"/admin"}>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoUrl} />
              </Link>
            </li>
          </>
        )}

        {!username && (
          <>
            <li>
              <Link href={"/enter"}>
                <button className="btn-blue">Sign In</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
