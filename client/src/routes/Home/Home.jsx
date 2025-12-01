import Calendar from "../../components/Calendar/Calendar";
import Scheduler from "../../components/Scheduler/Scheduler";
import styles from "./Home.module.css";
import React from "react";
import RegisterForm from "../../components/Register/RegisterForm";
import LoginForm from "../../components/Login/LoginForm";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      {/* <Calendar /> */}
      {/* <Scheduler /> */}
      {/* <RegisterForm /> */}
      <LoginForm />
    </div>
  );
};

export default Home;
