import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  //sign in google
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      console.log("not logged in");
    }
  }, []);

  return (
    <div className="shadow-2xl	 mt-32 p-10 text-gray-700 rounded-lg">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          onClick={googleLogin}
          className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
