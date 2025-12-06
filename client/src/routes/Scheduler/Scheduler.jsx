import styles from "./Scheduler.module.css";
import React, { use, useEffect, useMemo, useState } from "react";
import {
  MONTH_NAMES,
  WEEKDAY,
  changeMonth,
  convertDate,
  convertTime,
  formatDate,
  getWorkWeekFromDate,
  suffix,
} from "../../utils/Helpers";
import { getShifts, getUsers, getSchedules } from "../../utils/API";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faSquarePlus,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBackwardStep,
  faCalendarWeek,
  faEllipsis,
  faForwardStep,
  faNotdef,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import RegisterForm from "../../components/Register/RegisterForm";
import ShiftForm from "../../components/Shift/ShiftForm";
import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";

const Scheduler = () => {
  const today = new Date();
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [departments, setDepartments] = useState({
    sales: [],
    service: [],
    cleaner: [],
    technician: [],
    office: [],
    all: [],
  });
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDpt, setSelectedDpt] = useState("all");
  const [selectedShift, setSelectedShift] = useState("");
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [addingShift, setAddingShift] = useState(false);
  const [pendingAssignments, setPendingAssignments] = useState({});

  useEffect(() => {
    const shiftGet = async () => {
      const shiftList = await getShifts();
      if (!shiftList.success) {
        toast.error(shiftList.message);
        return;
      }
      setShifts(shiftList.shifts);
    };
    shiftGet();
  }, [addingShift]);

  useEffect(() => {
    const usersGet = async () => {
      const userList = await getUsers();
      if (!userList.success) {
        toast.error(userList.message);
        return;
      }
      setDepartments({
        ...departments,
        sales: userList.users.filter((u) => u.department === "sales"),
        service: userList.users.filter((u) => u.department === "service"),
        cleaner: userList.users.filter((u) => u.department === "cleaner"),
        technician: userList.users.filter((u) => u.department === "technician"),
        office: userList.users.filter((u) => u.department === "office"),
        all: userList.users,
      });
    };

    usersGet();
  }, [addingEmployee]);

  useEffect(() => {
    const scheduleGet = async () => {
      const scheduleList = await getSchedules();
      if (!scheduleList.success) {
        toast.error(scheduleList.message);
        return;
      }
      setSchedules(scheduleList.schedules);
    };
    scheduleGet();
  }, []);

  //GENERATE SCHEDULE ROWS [USER ID, ...WEEKDAYS]
  const scheduleRows = useMemo(() => {
    return departments[selectedDpt].map((user) => {
      return currentWeek.map((day) => {
        const dateStr = formatDate(day);

        const key = `${user.id}|${dateStr}`;
        const pending = pendingAssignments[key];

        const scheduledShift = schedules.find(
          (s) => s.user_id === user.id && s.shift_date === dateStr
        );

        const state = pending
          ? "staged"
          : scheduledShift
          ? "committed"
          : "empty";

        const timeOffRequest = user.time_off_requests?.find(
          (req) => req.start_date <= dateStr && dateStr <= req.end_date
        );

        return {
          user_id: user.id,
          date: day,
          shift_id: pending?.shift_id ?? scheduledShift?.shift_id ?? null,
          schedule_id: scheduledShift?.id ?? null,
          location:
            pending?.location ?? scheduledShift?.location ?? "lake_charles",
          is_time_off: !!timeOffRequest,
          time_off_request: timeOffRequest || null,
          status: state,
        };
      });
    });
  }, [departments, selectedDpt, currentWeek, pendingAssignments, schedules]);

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

  //
  // WEEK CONTROLS
  //
  const goPrev = () => {
    const prevMonday = new Date(currentWeek[0]);
    prevMonday.setDate(prevMonday.getDate() - 7);
    setCurrentWeek(buildWeekFromMonday(prevMonday));
  };

  const goToday = () => {
    setCurrentWeek(getWorkWeekFromDate(today));
  };

  const goNext = () => {
    const nextMonday = new Date(currentWeek[0]);
    nextMonday.setDate(nextMonday.getDate() + 7);
    setCurrentWeek(buildWeekFromMonday(nextMonday));
  };

  const handleCellClick = (cell) => {
    if (!selectedShift) {
      toast.error("Select a shift first");
      return;
    }
    if (cell.is_time_off) {
      toast.error("Employee has approved time off");
      return;
    }

    const key = `${cell.user_id}|${formatDate(cell.date)}`;

    const newAssignment = {
      user_id: cell.user_id,
      shift_id: selectedShift,
      shift_date: formatDate(cell.date),
      location: cell.location,
    };

    if (selectedShift === 9998) {
      const startTime = prompt("Enter start time (HH:MM)");
      const endTime = prompt("Enter end time (HH:MM)");

      if (!startTime || !endTime) {
        toast.error("Custom shifts require start and end times");
        return;
      }

      newAssignment.custom_start_time = startTime;
      newAssignment.custom_end_time = endTime;
    }

    setPendingAssignments((prev) => ({
      ...prev,
      [key]: newAssignment,
    }));
  };

  const submitSchedule = async () => {
    if (!confirm("Submit Schedule?")) return;
    const assignments = Object.values(pendingAssignments);

    if (assignments.length === 0) {
      toast.error("No changes to submit");
      return;
    }

    const response = await fetch("/api/create/bulk_schedule", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ schedules: assignments }),
    });
    const data = await response.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    const refreshSchedule = await getSchedules();
    if (refreshSchedule.success) {
      setSchedules(refreshSchedule.schedules);
    }
    setPendingAssignments({});
  };

  const handleDeleteSchedule = async (cell) => {
    if (!cell.schedule_id) return;

    if (!confirm("Delete this scheduled shift?")) return;

    const response = await fetch(`/api/delete/schedule/${cell.schedule_id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    const res = await getSchedules();
    if (res.success) {
      setSchedules(res.schedules);
    }
  };

  const ClearWeek = async () => {
    if (!confirm("Clear all schedules for this week?")) return;

    const start = formatDate(currentWeek[0]);
    const end = formatDate(currentWeek[currentWeek.length - 1]);

    const response = await fetch("api/delete/scheduled_week", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: start,
        end_date: end,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message + " " + "Refresh screen to reflect changes");

    const newSchedules = await getSchedules();
    if (newSchedules.success) {
      setSchedules(newSchedules.schedules);
    }

    setPendingAssignments({});
  };

  const getShiftByID = (id) => shifts.find((s) => s.id === id);

  return (
    <div className={styles.schedulerMaster}>
      <div className={styles.controlBar}>
        <div className={styles.cbRow1}>
          <p>{getWeekHeader()}</p>
          <div className={styles.weekShift}>
            <button onClick={goPrev}>
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>
            <button onClick={goToday}>
              <FontAwesomeIcon icon={faCalendarWeek} />
            </button>
            <button onClick={goNext}>
              <FontAwesomeIcon icon={faForwardStep} />
            </button>
          </div>
        </div>
        <div className={styles.cbRow2}>
          <select
            name="department"
            value={selectedDpt}
            onChange={(e) => setSelectedDpt(e.target.value)}
          >
            {Object.keys(departments).map((dpt, index) => (
              <option value={dpt} key={index}>
                {dpt}
              </option>
            ))}
          </select>
          <div className={styles.shiftControls}>
            {shifts?.map(({ id, title, start_time, end_time }) => (
              <button
                key={id}
                onClick={() => setSelectedShift(selectedShift === id ? "" : id)}
                className={selectedShift === id ? styles.selectedShift : ""}
              >
                {title}
              </button>
            ))}
            <button
              className={styles.deleteShiftButton}
              onClick={ClearWeek}
              disabled={schedules.length === 0}
            >
              Clear Schedule
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <button
            className={styles.addShiftButton}
            onClick={() => setAddingShift(!addingShift)}
          >
            <FontAwesomeIcon icon={faClock} />
          </button>
          {addingShift && (
            <div className={styles.cbShiftForm}>
              <ShiftForm bool={setAddingShift} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.scheduleBlock}>
        <div className={styles.scheduleHeader}>
          <div
            className={clsx(styles.gridCell, [
              styles.employeeHeader,
              styles.gridHeader,
            ])}
          >
            <h3>Employee</h3>
          </div>
          {currentWeek.map((day, i) => (
            <div
              key={i}
              className={clsx(styles.gridCell, [
                styles.dateCellHeader,
                styles.gridHeader,
              ])}
            >
              <span>{WEEKDAY[day.getDay()]}</span>
              <span>
                {MONTH_NAMES[day.getMonth()]}{" "}
                {day.getDate() + suffix(day.getDate())}
              </span>
            </div>
          ))}
        </div>
        {scheduleRows.map((userRow, rowIndex) => (
          <div className={styles.userRow} key={rowIndex}>
            {/* Employee Name */}
            <div className={clsx(styles.gridCell, [styles.employeeCell])}>
              <h4>
                <div>
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <span>
                    {
                      departments[selectedDpt].find(
                        (u) => u.id === userRow[0].user_id
                      )?.first_name
                    }{" "}
                    {
                      departments[selectedDpt].find(
                        (u) => u.id === userRow[0].user_id
                      )?.last_name[0]
                    }
                    {"."}
                  </span>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    onClick={() => navigate(`/user/${userRow[0].user_id}`)}
                  />
                </div>
              </h4>
            </div>
            {/* Day Cells */}
            {userRow.map((cell, cellIndex) => {
              const shift = getShiftByID(cell.shift_id);

              let display = "";
              if (cell.is_time_off) {
                display = null;
              } else if (shift) {
                if (shift.id === 9998) {
                  display = `${shift.title} ${
                    (cell.custom_start_time || "--") +
                    "-" +
                    cell.custom_end_time
                  }`;
                }
              } else if (shift.id === 9999) {
                display = shift.title;
              } else {
                display = shift.title;
              }
              return (
                <div
                  className={clsx(
                    styles.gridCell,
                    styles.dateCell,
                    cell.is_time_off && styles.timeOffCell,
                    cell.status === "staged" && styles.stagedCell,
                    cell.status === "committed" && styles.committedCell
                  )}
                  key={cellIndex}
                  onClick={() => {
                    if (cell.shift_id && !selectedShift) {
                      handleDeleteSchedule(cell);
                    } else {
                      handleCellClick(cell);
                    }
                  }}
                >
                  {cell.is_time_off ? (
                    <FontAwesomeIcon icon={faNotdef} />
                  ) : cell.shift_id ? (
                    <span className={styles.shiftAssignedCell}>{display}</span>
                  ) : (
                    <FontAwesomeIcon icon={faSquarePlus} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className={styles.scheduleFooter}>
          {addingEmployee && (
            <div className={styles.sfUserForm}>
              <RegisterForm bool={setAddingEmployee} />
            </div>
          )}
          <button
            className={styles.footerCell}
            onClick={() => setAddingEmployee(!addingEmployee)}
            style={{
              color: addingEmployee ? "#fefefe" : "",
              backgroundColor: addingEmployee ? "transparent" : "",
              fontSize: addingEmployee ? "1.5rem" : "",
              border: "none",
            }}
          >
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
          {currentWeek.map((day, index) => (
            <div key={index} className={styles.footerCell}></div>
          ))}
          <button onClick={submitSchedule} className={styles.submitShiftButton}>
            Submit Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
