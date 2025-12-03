import EMPLOYEES from "../assets/employees.json";

export const CLEANERS = EMPLOYEES.cleaner;
export const FRIDGE_TECHS = EMPLOYEES.technician.fridges;
export const WASHER_TECHS = EMPLOYEES.technician.washers;
export const DRYER_RANGE_TECHS = EMPLOYEES.technician["dryers-ranges"];
export const SALES = EMPLOYEES.sales;
export const SERVICE = EMPLOYEES.service;
export const OFFICE = EMPLOYEES.other;

export const MONTH_NAMES = [
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

export const WEEKDAY = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const suffix = (n) => {
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

export const getCalendarDays = (year, month) => {
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days = [];

  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= numberOfDays; i++) {
    days.push(new Date(year, month, i));
  }

  return days;
};

export const changeMonth = (
  offset,
  setCurrentMonth,
  setCurrentYear,
  currentYear
) => {
  setCurrentMonth((prev) => {
    let newMonth = prev + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentYear(newYear);
    return newMonth;
  });
};

export const getWorkWeekFromDate = (date) => {
  let d = new Date(date);

  // Sunday ? treat it as next day (monday)
  if (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }

  const dayOfWeek = d.getDate();
  const monday = new Date(d);

  //move back to monday
  monday.setDate(d.getDate() - (dayOfWeek - 1));

  const week = [];
  for (let i = 0; i < 6; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }

  return week;
};

export const convertTime = (time) => {
  if (time === "OFF") return time;

  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
};

export const convertDate = (date_str) => {
  const [year, month, day] = date_str.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${day + suffix(day)}, ${year}`;
};
