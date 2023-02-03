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
import Datepicker from "react-tailwindcss-datepicker";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../utils/firebase";

export default function PostFaculty() {
  //Form state
  const [id, setID] = useState(`${v4()}`);
  const [imageUpload, setImageUpload] = useState(null);
  const [post, setPost] = useState({
    description: "",
    name: "",
    photo: "",
    schoolYear: {
      startDate: "",
      endDate: "",
    },
    status: "",
  });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  //Submit Post
  const submitPost = async (e) => {
    e.preventDefault();
    //Run checks for description
    if (
      !post.description ||
      !post.name ||
      !post.photo ||
      !post.schoolYear ||
      !post.status
    ) {
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
      const docRef = doc(db, "posts-faculty", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      //Make a new post
      const collectionRef = collection(db, "posts-faculty");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });

      if (imageUpload == null) return;
      const imageRef = ref(storage, `images/${id}`);
      uploadBytes(imageRef, imageUpload).then(() => {
        console.log(`img uploaded`);
      });
      setPost({ description: "" });
      toast.success("Post has been made 🚀", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/faculty-list");
    }
  };

  //Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  console.log(post);
  console.log(imageUpload);

  return (
    <div className=" p-12 shadow-2xl rounded-lg max-w-md mx-auto mb-10">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id")
            ? "Edit Faculty Credentials"
            : "Create Faculty Credentials"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Name</h3>
          <input
            value={post.name}
            onChange={(e) => setPost({ ...post, name: e.target.value })}
            type="text"
            id="first_name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your name"
            required
          />
          <h3 className="text-lg font-medium py-2">Upload Image</h3>
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              {post?.photo ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-white overflow-hidden">
                  <img
                    src={URL.createObjectURL(imageUpload)}
                    alt="uploaded img"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      aria-hidden="true"
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                </>
              )}
              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                onChange={(e) => {
                  setPost({ ...post, photo: `${id}` });
                  setImageUpload(event.target.files[0]);
                }}
              />
            </label>
          </div>

          <h3 className="text-lg font-medium py-2">School Year</h3>
          <Datepicker
            useRange={false}
            value={post.schoolYear}
            onChange={(e) => setPost({ ...post, schoolYear: e })}
          />
          {/* status */}
          <h3 className="text-lg font-medium py-2">Options Panel</h3>
          <ul class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
              <div class="flex items-center pl-3">
                <input
                  value={post.status}
                  onChange={(e) => setPost({ ...post, status: "Enrolled" })}
                  id="list-radio-license"
                  type="radio"
                  name="list-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  for="list-radio-license"
                  class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Enrolled
                </label>
              </div>
            </li>
            <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
              <div class="flex items-center pl-3">
                <input
                  value={post.status}
                  onChange={(e) => setPost({ ...post, status: " Drop-out" })}
                  id="list-radio-id"
                  type="radio"
                  name="list-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  for="list-radio-id"
                  class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Drop-out
                </label>
              </div>
            </li>
            <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
              <div class="flex items-center pl-3">
                <input
                  value={post.status}
                  onChange={(e) => setPost({ ...post, status: " Shiftee" })}
                  id="list-radio-millitary"
                  type="radio"
                  name="list-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
                <label
                  for="list-radio-millitary"
                  class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Shiftee
                </label>
              </div>
            </li>
          </ul>

          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            id="message"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
