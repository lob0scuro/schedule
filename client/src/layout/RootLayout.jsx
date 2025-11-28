import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <header>Schedules</header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Matt's Appliances</p>
      </footer>
    </>
  );
};

export default RootLayout;
