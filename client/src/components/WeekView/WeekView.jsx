import styles from "./WeekView.module.css";
import React, { useEffect, useState } from "react";
import {
  WEEKDAY,
  MONTH_NAMES,
  getCalendarDays,
  changeMonth,
  buildWorkWeeks,
} from "../../utils/Helpers";

const WeekView = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const month_name = MONTH_NAMES[currentMonth];
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    setWeeks(buildWorkWeeks(currentYear, currentMonth));
  }, [currentMonth, currentYear]);

  const days = getCalendarDays();

  return (
    <div className={styles.weekViewMasterBlock}>
      <div className={styles.weeksHeader}>
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
      <div className={styles.weekdayList}>
        {WEEKDAY.map((d) => (
          <p>{d}</p>
        ))}
      </div>
      <div className={styles.weeksBlock}>
        {weeks.map((week, week_index) => (
          <div key={week_index} className={styles.weekRow}>
            {week.map((day, day_index) =>
              day ? (
                <div key={day_index} className={styles.weekday}>
                  {day.getDate()}
                </div>
              ) : (
                <div className={styles.empty}></div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
