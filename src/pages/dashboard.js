import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth, db } from "../../utils/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Message from "components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [postsFaculty, setPostsFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const getData = async () => {
    if (loading) return;
    if (!user) return router.push("/auth/login");

    const postsCollectionRef = collection(db, "posts");
    const postsQuery = query(postsCollectionRef, where("user", "==", user.uid));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    const postsFacultyCollectionRef = collection(db, "announcement");
    const postsFacultyQuery = query(
      postsFacultyCollectionRef,
      where("user", "==", user.uid)
    );
    const unsubscribePostsFaculty = onSnapshot(
      postsFacultyQuery,
      (snapshot) => {
        setPostsFaculty(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );

    return () => {
      unsubscribePosts();
      unsubscribePostsFaculty();
    };
  };

  //Delete Post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  const deleteAnnouncement = async (id) => {
    const docRef = doc(db, "announcement", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <div className="p-2 border-gray-900 shadow-lg mb-20">
        <h1 className="text-xl font-medium mb-2">Your announcements</h1>

        {postsFaculty.length === 0 && (
          <h2 className="text-lg font-medium mb-2 text-center my-36">
            No announcements yet
          </h2>
        )}
        <div className="flex-col">
          {postsFaculty.map((post) => {
            return (
              <Message {...post} key={post.key}>
                <div
                  className="flex justify-around gap-4 w-full
              bg-white border border-gray-200 rounded-lg mt-2"
                >
                  <button
                    onClick={() => deleteAnnouncement(post.id)}
                    className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                  >
                    <BsTrash2Fill className="text-2xl" />
                    Delete
                  </button>
                  <Link
                    href={{
                      pathname: "/new-announcement",
                      query: { ...post },
                    }}
                  >
                    <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                      <AiFillEdit className="text-2xl" />
                      Edit
                    </button>
                  </Link>
                </div>
              </Message>
            );
          })}
        </div>
      </div>

      <div className="p-2 border-gray-900 shadow-lg mb-20">
        <h1 className="text-xl font-medium mb-2">Students you added</h1>
        {posts.length === 0 && (
          <h2 className="text-lg font-medium mb-2 text-center my-36">
            No students found
          </h2>
        )}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {posts.map((post) => {
            console.log(post, "pp");
            return (
              <Message {...post} key={post.key}>
                <div
                  className="flex justify-around gap-4 w-full
              bg-white border border-gray-200 rounded-lg mt-2"
                >
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                  >
                    <BsTrash2Fill className="text-2xl" />
                    Delete
                  </button>
                  <Link href={{ pathname: "/post", query: { ...post } }}>
                    <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                      <AiFillEdit className="text-2xl" />
                      Edit
                    </button>
                  </Link>
                </div>
              </Message>
            );
          })}
        </div>
      </div>
    </div>
  );
}
