import React, { useState, useEffect } from "react";

const StatusIndicator = ({ status }) => {
  const [statusString, setStatusString] = useState(null);

  useEffect(() => {
    if (typeof status === "string") {
      setStatusString(status);
    }
  }, [status]);

  if (!statusString) {
    return null;
  }

  return (
    <>
      {statusString === "Enrolled" ? (
        <span
          className={`flex w-2.5 h-2.5 bg-green-600 rounded-full mr-1.5 flex-shrink-0`}
        ></span>
      ) : statusString === "Shiftee" ? (
        <span
          className={`flex w-2.5 h-2.5 bg-cyan-600 rounded-full mr-1.5 flex-shrink-0`}
        ></span>
      ) : (
        <span
          className={`flex w-2.5 h-2.5 bg-red-600 rounded-full mr-1.5 flex-shrink-0`}
        ></span>
      )}
    </>
  );
};

export default StatusIndicator;
