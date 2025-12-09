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
          View Schedule <FontAwesomeIcon icon={faCalendarDay} />
        </Link>
        <Link to={"/time-off-request"}>
          Time Off Request <FontAwesomeIcon icon={faUserClock} />
        </Link>
        {user.role === "admin" && (
          <>
            <Link to={"/scheduler"}>
              Scheduler <FontAwesomeIcon icon={faCalendarDays} />
            </Link>
            <Link to={"/time-off-requests-status"}>
              Approve/Deny Time Off Requests{" "}
              <FontAwesomeIcon icon={faCheckToSlot} />
            </Link>
            <Link to={"/settings"}>
              Settings <FontAwesomeIcon icon={faGears} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
