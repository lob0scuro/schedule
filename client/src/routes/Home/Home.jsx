import Calendar from "../../components/Calendar/Calendar";
import ScheduleView from "../../components/ScheduleView/ScheduleView";
import WeekView from "../../components/WeekView/WeekView";
import styles from "./Home.module.css";
import React from "react";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <ScheduleView />
    </div>
  );
};

export default Home;
