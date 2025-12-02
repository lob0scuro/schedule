import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Home from "./routes/Home/Home";
import ProtectedLayout from "./layout/ProtectedLayout";
import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterForm";
import Scheduler from "./routes/Scheduler/Scheduler";
import TimeOffRequest from "./components/TimeOffRequest/TimeOffRequest";
import AdminLayout from "./layout/AdminLayout";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="time-off-request" element={<TimeOffRequest />} />
          <Route element={<AdminLayout />}>
            <Route path="scheduler" element={<Scheduler />} />
          </Route>
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
