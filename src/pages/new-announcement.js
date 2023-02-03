import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 } from "uuid";

export default function NewAnnouncement() {
  const [id, setID] = useState(`${v4()}`);
  const [imageUpload, setImageUpload] = useState(null);
  const [post, setPost] = useState({
    description: "",
    title: "",
  });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  //Submit Post
  const submitPost = async (e) => {
    e.preventDefault();
    //Run checks for description
    if (!post.description || !post.title) {
      toast.error("Please fill all fields 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (post.description.length > 300) {
      toast.error("Description too long 😅", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "announcement", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);

      // setPost({ description: "", title: "" });
      // toast.success("Post has been edited 🚀", {
      //   position: toast.POSITION.TOP_CENTER,
      //   autoClose: 1500,
      // });
      return route.push("/announcement");
    } else {
      //Make a new post
      const collectionRef = collection(db, "announcement");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });

      // setPost({ description: "", title: "" });
      // toast.success("Post has been made 🚀", {
      //   position: toast.POSITION.TOP_CENTER,
      //   autoClose: 1500,
      // });
      return route.push("/announcement");
    }
  };

  //Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({
        description: routeData.description,
        id: routeData.id,
        title: routeData.title,
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);
  console.log(post);
  return (
    <div className=" p-12 shadow-2xl rounded-lg max-w-md mx-auto mb-10">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit Announcement" : "New Announcement"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Title</h3>
          <input
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            type="text"
            class="bg-gray-50 border mb-5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter title"
            required
          />
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            id="message"
            rows="10"
            cols="10"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Announcement..."
          ></textarea>
          <p
            className={` font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : "text-cyan-600"
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Add
        </button>
      </form>
    </div>
  );
}
