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
import TimeOffRequest from "./routes/TimeOffRequest/TimeOffRequest";
import AdminLayout from "./layout/AdminLayout";
import TimeOffStatus from "./routes/TimeOffRequest/Status/TimeOffStatus";
import Scheduler from "./routes/Scheduler/Scheduler";
import UserProfile from "./routes/User/UserProfile";
import ViewSchedule from "./routes/User/ViewUserSchedule/ViewSchedule";
import Settings from "./routes/Settings/Settings";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="time-off-request" element={<TimeOffRequest />} />
          <Route path="view-schedule/:id" element={<ViewSchedule />} />
          <Route element={<AdminLayout />}>
            <Route path="scheduler" element={<Scheduler />} />
            <Route path="user/:id" element={<UserProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="time-off-requests-status"
              element={<TimeOffStatus />}
            />
          </Route>
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
