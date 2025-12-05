import { useAuth } from "../../../context/AuthContext";
import { getWorkWeekFromDate, MONTH_NAMES } from "../../../utils/Helpers";
import styles from "./ViewSchedule.module.css";
import React, { useState } from "react";

const ViewSchedule = () => {
  const today = new Date();
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));

  const getWeekHeader = () => {
    const start = currentWeek[0];
    const end = currentWeek[currentWeek.length - 1];
    const startMonth = MONTH_NAMES[start.getMonth()];
    const endMonth = MONTH_NAMES[end.getMonth()];
    return startMonth === endMonth
      ? `${startMonth} ${start.getDate()} - ${end.getDate()}`
      : `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  };

  return (
    <div>
      <h1>Schedule for {getWeekHeader()}</h1>
    </div>
  );
};

export default ViewSchedule;
