"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

function navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="w-full shadow-md p-3">
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 sm:mb-0">
          Unknown Message
        </a>
        {session ? (
          <>
            <span>Welcome {user?.username || user?.email}</span>
            <Button className="w-full sm:w-auto cursor-pointer" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="w-full sm:w-auto cursor-pointer">
              <Button>Login</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default navbar;
