import styles from "./SchedulerBeta.module.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  MONTH_NAMES,
  WEEKDAY,
  changeMonth,
  convertDate,
  convertTime,
  getWorkWeekFromDate,
} from "../../utils/Helpers";
import { getShifts, getUsers } from "../../utils/API";
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
  faForwardStep,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import RegisterForm from "../../components/Register/RegisterForm";
import ShiftForm from "../../components/Shift/ShiftForm";

const SchedulerBeta = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [departments, setDepartments] = useState({
    sales: [],
    service: [],
    cleaner: [],
    technician: [],
    office: [],
    all: [],
  });
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [addingShift, setAddingShift] = useState(false);
  const [selectedDpt, setSelectedDpt] = useState("all");

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
    console.log(currentWeek);
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
  }, []);

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
    <div className={styles.schedulerMaster}>
      <div className={styles.controlBar}>
        <div className={styles.cbRow1}>
          <p>{getWeekHeader()}</p>
          <div className={styles.weekShift}>
            <button>
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>
            <button>
              <FontAwesomeIcon icon={faCalendarWeek} />
            </button>
            <button>
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
            {shifts.map(({ id, title, start_time, end_time }) => (
              <button key={id}>{title}</button>
            ))}
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
        {departments[selectedDpt].map(({ id, first_name, last_name }) => (
          <p key={id}>{first_name}</p>
        ))}
      </div>
    </div>
  );
};

export default SchedulerBeta;
