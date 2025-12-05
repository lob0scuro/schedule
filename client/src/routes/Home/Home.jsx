import Calendar from "../../components/Calendar/Calendar";
import styles from "./Home.module.css";
import React from "react";
import RegisterForm from "../../components/Register/RegisterForm";
import LoginForm from "../../components/Login/LoginForm";
import TimeOffRequest from "../TimeOffRequest/TimeOffRequest";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className={styles.homeContainer}>
      <div className={styles.navLinks}>
        {user.role === "admin" && (
          <>
            <Link to={"/scheduler"}>Scheduler</Link>
            <Link to={"/time-off-requests-status"}>
              Approve/Deny Time Off Requests
            </Link>
          </>
        )}
        <Link to={"/time-off-request"}>Time Off Request</Link>
      </div>
    </div>
  );
};

export default Home;
