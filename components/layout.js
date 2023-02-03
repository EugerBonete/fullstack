import React from "react";
import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <div className="mx-6 md:max-w-4xl md:mx-auto font-poppins">
        <main>{children}</main>
      </div>
    </>
  );
}
