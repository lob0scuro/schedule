import styles from "./Calendar.module.css";
import React, { useState } from "react";
import {
  WEEKDAY,
  MONTH_NAMES,
  getCalendarDays,
  changeMonth,
} from "../../utils/Helpers";

const Calendar = () => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const month_name = MONTH_NAMES[currentMonth];

  const days = getCalendarDays(currentYear, currentMonth);

  return (
    <div className={styles.calendarMasterBlock}>
      <div className={styles.calendarHeader}>
        <button
          onClick={() =>
            changeMonth(-1, setCurrentMonth, setCurrentYear, currentYear)
          }
        >
          prev
        </button>
        <h2>
          {month_name} {currentYear}
        </h2>
        <button
          onClick={() =>
            changeMonth(1, setCurrentMonth, setCurrentYear, currentYear)
          }
        >
          next
        </button>
      </div>

      <div className={styles.calContainer}>
        <div className={styles.weekday}>
          {WEEKDAY.map((d) => (
            <p>{d}</p>
          ))}
        </div>
        <div className={styles.cal}>
          {days.map((day, index) =>
            day ? (
              <div
                key={index}
                className={
                  day.getDate() === today.getDate() &&
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear()
                    ? styles.current
                    : ""
                }
              >
                {day.getDate()}
              </div>
            ) : (
              <div key={index} className={styles.empty}></div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
