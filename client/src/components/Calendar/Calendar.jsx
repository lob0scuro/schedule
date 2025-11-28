import styles from "./Calendar.module.css";
import React from "react";

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

  const month_name = MONTH_NAMES[date.getMonth()];
  const day_of_month = date.getDate() + suffix(date.getDay());
  const day_of_week = WEEKDAY[date.getDay()];
  const current_year = date.getFullYear();

  const daysInMonth = (year, month) => {
    const numDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = daysInMonth(current_year, date.getMonth());

  return (
    <>
      <h2>
        {month_name} {current_year}
      </h2>
      <div className={styles.weekday}>
        {WEEKDAY.map((d) => (
          <span>{d}</span>
        ))}
      </div>
      <div className={styles.cal}>
        {days.map((day, index) => (
          <>
            <div
              key={index}
              className={day.getDate() === date.getDate() ? styles.current : ""}
            >
              <p>{day.getDate()}</p>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default Calendar;
