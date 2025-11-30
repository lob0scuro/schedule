import styles from "./Scheduler.module.css";
import React, { useState } from "react";
import {
  WEEKDAY,
  MONTH_NAMES,
  getWorkWeekFromDate,
  CLEANERS,
  DRYER_RANGE_TECHS,
  FRIDGE_TECHS,
  OFFICE,
  SALES,
  SERVICE,
  WASHER_TECHS,
  suffix,
} from "../../utils/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBackwardStep,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";

const EMPLOYEES = {
  cleaners: CLEANERS,
  office: OFFICE,
  sales: SALES,
  service: SERVICE,
  washer_techs: WASHER_TECHS,
  fridge_techs: FRIDGE_TECHS,
  dryer_range_techs: DRYER_RANGE_TECHS,
  all: [
    ...CLEANERS,
    ...OFFICE,
    ...SALES,
    ...SERVICE,
    ...WASHER_TECHS,
    ...FRIDGE_TECHS,
    ...DRYER_RANGE_TECHS,
  ],
};

const Scheduler = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [chosenTeam, setChosenTeam] = useState("all");

  // Helper: Build Mon-Sat week from a Monday
  const buildWeekFromMonday = (monday) => {
    const week = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  };

  // Prev / Next / Today handlers
  const goPrev = () => {
    const prevMonday = new Date(currentWeek[0]);
    prevMonday.setDate(prevMonday.getDate() - 7);
    setCurrentWeek(buildWeekFromMonday(prevMonday));
  };

  const goNext = () => {
    const nextMonday = new Date(currentWeek[0]);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentWeek(buildWeekFromMonday(nextMonday));
  };

  const goToday = () => {
    setCurrentWeek(getWorkWeekFromDate(today));
  };

  // Week header (handles month boundaries)
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
    <div className={styles.schedulerMasterBlock}>
      {/* CONTROL BAR */}
      <div className={styles.controlBar}>
        <div className={styles.dateBar}>
          <div className={styles.dateDisplay}>
            <h3>{getWeekHeader()}</h3>
          </div>
          <div className={styles.weekRoller}>
            <button onClick={goPrev}>
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>
            <button onClick={goToday}>This Week</button>
            <button onClick={goNext}>
              <FontAwesomeIcon icon={faForwardStep} />
            </button>
          </div>
          <button className={styles.addShiftButton}>Add Shift</button>
        </div>

        <div className={styles.userBar}>
          <div className={styles.departmentSelect}>
            <label htmlFor="department">Department</label>
            <select
              name="department"
              value={chosenTeam || ""}
              onChange={(e) => setChosenTeam(e.target.value)}
            >
              <option value="all">--all departments--</option>
              {Object.entries(EMPLOYEES).map(([department], index) => (
                <option value={department} key={index}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      <div className={styles.theCal}>
        {chosenTeam && (
          <div className={styles.calMainBody}>
            <div className={styles.employeeList}>
              <div>Employees</div>
              {EMPLOYEES[chosenTeam].map(({ name }, index) => (
                <div key={index} className={styles.employeeTile}>
                  <FontAwesomeIcon icon={faUser} /> {name}
                </div>
              ))}
              <div className={styles.addEmployee}>
                <button>Add Employee</button>
              </div>
            </div>
            {currentWeek.map((day, index) => (
              <div key={index} className={styles.dayCell}>
                <div className={styles.dayHeader}>
                  {WEEKDAY[day.getDay()]},{" "}
                  {day.getDate() + suffix(day.getDate())}
                </div>
                {/* Render shifts here */}
                {EMPLOYEES[chosenTeam].map((name, index) => (
                  <div>
                    <FontAwesomeIcon icon={faSquarePlus} />
                  </div>
                ))}
                <div className={styles.spacer}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scheduler;
