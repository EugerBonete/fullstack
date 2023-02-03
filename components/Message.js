import React, { useEffect, useLayoutEffect, useState } from "react";
import { storage } from "../utils/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { LazyLoadImage } from "react-lazy-load-image-component";
import StatusIndicator from "./StatusIndicator";
import { useRouter } from "next/router";

export default function Message({
  children,
  avatar,
  username,
  description,
  photo,
  name,
  startDate,
  endDate,
  status,
  title,
  timestamp,
}) {
  const [url, setUrl] = useState();

  const router = useRouter();

  useLayoutEffect(() => {
    getDownloadURL(ref(storage, `images/${photo}`))
      .then((url) => {
        setUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      //    month: "long",
      //  day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  function timestampToDate(timestamp) {
    if (!timestamp) return null;
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleDateString("default", {
      year: "numeric",
      // month: "long",
      // day: "numeric",
    });
  }

  const timeStampValue = {
    seconds: timestamp?.seconds,
    nanoseconds: timestamp?.nanoseconds,
  };
  return (
    <div
      className={`bg-white rounded-lg h-full ${
        router.asPath === "/announcement" && "my-10"
      }`}
    >
      {router.asPath === "/announcement" ? (
        <div class=" p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {description}
          </p>
          <div
            class={`flex items-center justify-end gap-2 ${
              router.asPath !== "/" && "justify-end"
            }`}
          >
            <p className="text-white">{`${timestampToDate(timeStampValue)}`}</p>
            <img src={avatar} alt="avatar img" className="w-5 rounded-full" />
            <span class="mt-0.5 text-xs font-normal text-gray-700 dark:text-gray-400">
              Added by: {username}
            </span>
          </div>
        </div>
      ) : (
        <div class=" bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          {url && (
            <img
              className={`rounded-t-lg w-full 
           ${
             router.asPath === "/dashboard" || router.asPath === "/"
               ? "h-40"
               : "h-80"
           }
           object-cover overflow-hidden`}
              loading="lazy"
              src={url}
              alt={`${photo}`}
            />
          )}
          <div class="p-5">
            {name && (
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {name}
              </h5>
            )}
            {title && (
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {title}
              </h5>
            )}
            <div className="flex align-center">
              <span
                className={`flex items-center text-sm ${
                  router.asPath !== "/" && "text-lg"
                } font-medium text-gray-900 dark:text-white`}
              >
                <StatusIndicator status={status} />
                {status}
              </span>
            </div>
            {startDate && endDate && (
              <span
                className={`${
                  router.asPath !== "/" ? "text-md" : "text-xs"
                } flex items-center text-sm font-medium text-gray-900 dark:text-slate-400 mt-2
                 `}
              >{`${formatDate(startDate)} - ${formatDate(endDate)}`}</span>
            )}

            {description && (
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {description}
              </p>
            )}
            <div
              class={`flex items-center mt-5 gap-2 ${
                router.asPath !== "/" && "justify-end"
              }`}
            >
              <img src={avatar} alt="avatar img" className="w-5 rounded-full" />
              <h2 class=" text-xs font-normal text-gray-700 dark:text-gray-400">
                Added by: {username}
              </h2>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
