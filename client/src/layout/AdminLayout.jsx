import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { user } = useAuth();

  return user.role === "admin" ? <Outlet /> : <Navigate to={"/"} />;
};

export default AdminLayout;
