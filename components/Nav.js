import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="flex justify-between items-center py-5 px-10 w-screen font-poppins">
      <Link href="/announcement">
        <button className="text-lg font-medium">Announcements</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <p className="py-2 px-4 text-sm bg-cyan-500 text-white font-medium ml-8 rounded">
              Join Now
            </p>
          </Link>
        )}

        {user && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {/* <Link href={"/faculty-list"}>
                <button className="py-2 px-4 text-sm font-medium ml-2 rounded-sm">
                  Faculty
                </button>
              </Link> */}
              <Link href={"/"}>
                <button className="py-2 px-4 text-sm font-medium ml-2 rounded-sm">
                  Students
                </button>
              </Link>
              <Link href={"/dashboard"}>
                <button className="py-2 px-4 text-sm font-medium ml-2 rounded-sm">
                  Edit
                </button>
              </Link>
              {/* <Link href={"/post-faculty"}>
                <button className="py-2 px-4 text-sm bg-cyan-500 text-white font-medium ml-2 rounded-sm">
                  + Faculty
                </button>
              </Link> */}
              <Link href={"/post"}>
                <button className="py-2 px-4 text-sm bg-cyan-500 text-white font-medium ml-2 rounded-sm">
                  + Student
                </button>
              </Link>
              <button
                className="font-medium text-white text-sm bg-gray-800 py-2 px-4 "
                onClick={() => auth.signOut()}
              >
                Sign out
              </button>
              <Link href={"/dashboard"}>
                <img
                  className="w-12 rounded-full cursor-pointer"
                  src={user.photoURL}
                  alt="user image"
                />
              </Link>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}
