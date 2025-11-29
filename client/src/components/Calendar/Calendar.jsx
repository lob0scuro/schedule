import styles from "./Calendar.module.css";
import React, { useState } from "react";

const MONTH_NAMES = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const suffix = (n) => {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const Calendar = () => {
  const date = new Date();

  const day_of_month = date.getDate() + suffix(date.getDay());
  const [current_year, set_current_year] = useState(date.getFullYear());
  const [current_month, set_current_month] = useState(date.getMonth());
  const month_name = MONTH_NAMES[current_month];

  const daysInMonth = (year, month) => {
    const numDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const changeMonth = (offset) => {
    set_current_month((prev) => {
      let newMonth = prev + offset;
      let newYear = current_year;

      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }

      set_current_year(newYear);
      return newMonth;
    });
  };

  const days = daysInMonth(current_year, current_month);
  const weeksInMonth = Math.floor(days.length / 7);

  return (
    <>
      <div className={styles.calendarHeader}>
        <button onClick={() => changeMonth(-1)}>prev</button>
        <h2>
          {month_name} {current_year}
        </h2>
        <button onClick={() => changeMonth(1)}>next</button>
      </div>
      <div className={styles.weekday}>
        {WEEKDAY.map((d) => (
          <p>{d}</p>
        ))}
      </div>
      <div className={styles.cal}>
        {days.map((day, index) =>
          day === null ? (
            <div key={index} className={styles.empty}></div>
          ) : (
            <>
              <div
                key={index}
                className={
                  day.getDate() === date.getDate() ? styles.current : ""
                }
              >
                <p>{day.getDate()}</p>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default Calendar;
