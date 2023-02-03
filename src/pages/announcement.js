import Head from "next/head";
import Message from "components/Message";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Link from "next/link";

export default function Announcement() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  //create state with all posts
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const getPosts = async () => {
    const collectionRef = collection(db, "announcement");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = allPosts.filter((item) =>
    `${item.title}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <main className="my-10">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-2">Announcement</h2>
        <Link href={"/new-announcement"}>
          <button className="py-2 px-4 text-sm bg-cyan-500 text-white font-medium ml-2 rounded-sm">
            + New
          </button>
        </Link>
      </div>
      <main className="mb-10">
        <h3 className="text-lg font-medium py-2">Search </h3>
        <input
          onChange={handleSearch}
          value={searchTerm}
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          placeholder="Search"
          required
        />
        {allPosts.length === 0 ||
          (filteredData.length === 0 && (
            <h2 className="text-xl font-medium mb-2 text-center my-36">
              No student found
            </h2>
          ))}

        <div class="flex-col">
          {filteredData.map((post) => {
            console.log(post, "pooost");
            return (
              <Link
                key={post.key}
                href={{
                  pathname: `announcement/${post.id}`,
                  query: { ...post },
                }}
              >
                <Message {...post}>
                  <button className=" text-white px-4 py-2 border-gray-200 rounded-lg ml-2 mt-2 shadow dark:bg-cyan-500 dark:border-cyan-500">
                    {post.comments?.length > 0 ? post.comments?.length : "0"}{" "}
                    Comments
                  </button>
                </Message>
              </Link>
            );
          })}
        </div>
      </main>
    </main>
  );
}
