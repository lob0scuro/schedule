import Calendar from "../../components/Calendar/Calendar";
import styles from "./Home.module.css";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faCheckToSlot,
  faGears,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className={styles.homeContainer}>
      <div className={styles.navLinks}>
        <Link to={`/view-schedule/${user.id}`}>
          <FontAwesomeIcon icon={faCalendarDay} /> View Schedule
        </Link>
        <Link to={"/time-off-request"}>
          <FontAwesomeIcon icon={faUserClock} />
          Time Off Request
        </Link>
        {user.role === "admin" && (
          <>
            <Link to={"/scheduler"}>
              <FontAwesomeIcon icon={faCalendarDays} />
              Scheduler
            </Link>
            <Link to={"/time-off-requests-status"}>
              <FontAwesomeIcon icon={faCheckToSlot} />
              Approve/Deny Time Off Requests{" "}
            </Link>
            <Link to={"/settings"} className={styles.settingsNav}>
              <FontAwesomeIcon icon={faGears} /> Settings
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
