import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedLayout;
