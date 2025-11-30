import styles from "./Scheduler.module.css";
import React, { useEffect, useState } from "react";
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

const EMPLOYEES = {
  cleaners: CLEANERS,
  office: OFFICE,
  sales: SALES,
  service: SERVICE,
  washer_techs: WASHER_TECHS,
  fridge_techs: FRIDGE_TECHS,
  dryer_range_techs: DRYER_RANGE_TECHS,
};

const Scheduler = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentDay, setCurrentDay] = useState(today.getDate());
  const [chosenTeam, setChosenTeam] = useState(null);
  const weeks = buildWorkWeeks(currentYear, currentMonth);
  const [currentWeek, setCurrentWeek] = useState();

  useEffect(() => {
    const currentWeekIndex = weeks.find((week) =>
      week.some(
        (day) =>
          day &&
          day.getFullYear() === today.getFullYear() &&
          day.getMonth() === today.getMonth() &&
          day.getDate() === today.getDate()
      )
    );

    setCurrentWeek(currentWeekIndex);
  }, [currentMonth, currentYear]);

  console.log(currentWeek);
  return (
    <div className={styles.schedulerMasterBlock}>
      <div className={styles.controlBar}>
        <div className={styles.dateBar}>
          <div className={styles.shiftViewButtons}>
            <button>Day</button>
            <button>Week</button>
            <button>Month</button>
          </div>
          <div className={styles.weekRoller}>
            <div>
              <button>prev</button>
              {/* <span className={styles.datesView}>{currentWeek.length}</span> */}
              <button>next</button>
            </div>
            <button className={styles.todaySwitch}>today</button>
          </div>
          <button className={styles.addShiftButton}>+shift</button>
        </div>
        <div className={styles.userBar}>
          <div className={styles.departmentSelect}>
            <label htmlFor="department">Department</label>
            <select
              name="department"
              value={chosenTeam}
              onChange={(e) => setChosenTeam(e.target.value)}
            >
              <option value="">--select department--</option>
              {Object.entries(EMPLOYEES).map(([department], index) => (
                <option value={department} key={index}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={styles.calendarView}>
        <h2>{MONTH_NAMES[today.getMonth()]}</h2>
        <div className={styles.theCal}>
          <div className={styles.departmentList}>
            <div className={styles.employee}></div>
            {chosenTeam &&
              EMPLOYEES[chosenTeam].map(({ name }, index) => (
                <div key={index} className={styles.employee}>
                  {name}
                </div>
              ))}
            {chosenTeam && <div className={styles.employee}>Add Employee</div>}
          </div>
          {chosenTeam &&
            currentWeek.map((day, index) => (
              <div key={index} className={styles.currentDayOfWeek}>
                <p>{day.getDate()}</p>
                {EMPLOYEES[chosenTeam].map(({ name }, index) => (
                  <div key={index}>set</div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
