"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

function navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;
  const url = window.location.pathname;

  return (
    <nav className="w-full shadow-md p-3 sticky top-0 bg-white">
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 sm:mb-0">
          True Message's
        </a>
        {session ? (
          <>
            <span>Welcome {user?.username || user?.email}</span>
            <div className="flex">
              <Button
                className=" sm:w-auto cursor-pointer"
                onClick={() => signOut()}
              >
                Logout
              </Button>
              {url == "/" && (
                <Link
                  href="/dashboard"
                  className="w-1/2 sm:w-auto cursor-pointer"
                >
                  <Button>Dashboard</Button>
                </Link>
              )}
            </div>
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
