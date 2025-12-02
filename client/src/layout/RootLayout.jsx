import React from "react";
import { Link, Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
const RootLayout = () => {
  const { user, setUser } = useAuth();

  const logout = async () => {
    if (!confirm("Logout?")) return;
    const response = await fetch("/api/auth/logout");
    const data = await response.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
    setUser(null);
  };
  return (
    <>
      <header>
        <Link to={"/"}>Scheduler</Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {user && <button onClick={logout}>LOGOUT</button>}
        <p>Matt's Appliances</p>
      </footer>
      <Toaster position="bottom-left" reverseOrder={true} />
    </>
  );
};

export default RootLayout;
