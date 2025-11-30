import Calendar from "../../components/Calendar/Calendar";
import Scheduler from "../../components/Scheduler/Scheduler";
import styles from "./Home.module.css";
import React from "react";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      {/* <Calendar /> */}
      <Scheduler />
    </div>
  );
};

export default Home;
