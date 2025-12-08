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

  const dayOfWeek = d.getDay();
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

export const getDatesInRange = (start, end) => {
  const dates = [];
  let current = new Date(start);

  const last = new Date(end);
  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const convertTime = (time) => {
  if (time === null) return "OFF";
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

export const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export const convertToMilitary = (input) => {
  if (!input) return null;

  input = input.trim().toLowerCase();

  if (input === "noon") return "12:00";
  if (input === "midnight") return "00:00";

  let match = input.match(/(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  let minute = parseInt(match[2] || "0", 10);
  let ampm = match[3];

  if (ampm) {
    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return (
    hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0")
  );
};

export const locationAbbr = (loc) => (loc === "lake_charles" ? "LC" : "JN");
