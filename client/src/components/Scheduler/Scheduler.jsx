import styles from "./Scheduler.module.css";
import React from "react";
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

const Scheduler = () => {
  return (
    <div className={styles.schedulerMasterBlock}>
      <div className={styles.controlBar}>
        <div>
          <div className={styles.shiftViewButtons}>
            <button>Day</button>
            <button>Week</button>
            <button>Month</button>
          </div>
          <div className={styles.weekRoller}>
            <div>
              <button>prev</button>
              <span className={styles.datesView}></span>
              <button>next</button>
            </div>
            <button className={styles.todaySwitch}>today</button>
          </div>
          <button className={styles.addShiftButton}>+shift</button>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
