import React, { useEffect, useState } from "react";
import Message from "components/Message";
import { auth, db } from "../../../utils/firebase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //submit msg
  const submitMessage = async () => {
    //check if user is authenticated
    if (!auth.currentUser) return router.push("/auth/login");

    if (!message) {
      toast.error("Don`t leave an empty message 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "announcement", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  //get comments
  const getComments = async () => {
    const docRef = doc(db, "announcement", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists) {
        setAllMessages(snapshot.data()?.comments || []);
      } else {
        setAllMessages([]);
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData} />
      <div className="my-4">
        <form onSubmit={(e) => e.preventDefault()} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="New Comment 😊"
            className="bg-gray-800 w-full p-2 text-white text-sm"
          />
          <button
            type="submit"
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit
          </button>
        </form>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message, key) => {
            return (
              <div className="bg-white p-4 my-4 border-2 rounded-lg" key={key}>
                <div className="flex items-center gap-2 mb-4 ">
                  <img
                    className="w-10 row-full"
                    src={message.avatar}
                    alt="user avatar"
                  />
                  <h2>{message.username}</h2>
                </div>
                <h2 className="overflow-scroll">{message.message}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
