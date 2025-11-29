import EMPLOYEES from "../assets/employees.json";

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

export const buildWorkWeeks = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const weeks = [];
  let week = [];

  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(new Date(year, month, day));

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
};

export const CLEANERS = EMPLOYEES.cleaner;
export const FRIDGE_TECHS = EMPLOYEES.technician.fridges;
export const WASHER_TECHS = EMPLOYEES.technician.washers;
export const DRYER_RANGE_TECHS = EMPLOYEES.technician["dryers-ranges"];
export const SALES = EMPLOYEES.sales;
export const SERVICE = EMPLOYEES.service;
export const OFFICE = EMPLOYEES.other;
