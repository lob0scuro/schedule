import styles from "./ScheduleView.module.css";
import React from "react";
import EMPLOYEES from "../../assets/employees.json";
import {
  WEEKDAY,
  MONTH_NAMES,
  getCalendarDays,
  changeMonth,
  buildWorkWeeks,
  CLEANERS,
  DRYER_RANGE_TECHS,
  FRIDGE_TECHS,
  OFFICE,
  SALES,
  SERVICE,
  WASHER_TECHS,
} from "../../utils/Helpers";

const ScheduleView = () => {
  return (
    <div className={styles.scheduleViewMasterBlock}>
      <h1>The View</h1>
    </div>
  );
};

export default ScheduleView;
