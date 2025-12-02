import styles from "./Scheduler.module.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  WEEKDAY,
  MONTH_NAMES,
  getWorkWeekFromDate,
  suffix,
  convertTime,
} from "../../utils/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBackwardStep,
  faForwardStep,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import RegisterForm from "../../components/Register/RegisterForm";
import ShiftForm from "../../components/Shift/ShiftForm";
import toast from "react-hot-toast";

const DraggableShift = ({ id, data, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
    cursor: "grab",
  };

  return (
    <button ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </button>
  );
};

const DroppableCell = ({ id, assignments, shifts }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const shiftMap = useMemo(() => {
    const map = {};
    shifts.forEach((s) => (map[s.id] = s));
    return map;
  }, [shifts]);

  const assignedShiftID = assignments?.[id];
  const assignedShift = assignedShiftID ? shiftMap[assignedShiftID] : null;

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? "var(--linkText)" : "transparent",
        color: isOver ? "var(--secondary)" : "var(--primary)",
        padding: "4px",
        borderRadius: "4px",
        minHeight: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {assignedShift ? (
        <DraggableShift
          id={`assigned-${id}`}
          data={{ shiftID: assignedShift.id, sourceCell: id }}
        >
          <span className={styles.shiftBadge}>
            [{convertTime(assignedShift.start_time)} -{" "}
            {convertTime(assignedShift.end_time)}]
          </span>
        </DraggableShift>
      ) : (
        <FontAwesomeIcon icon={faSquarePlus} />
      )}
    </div>
  );
};

const DroppableTrash = ({ onDelete }) => {
  const { isOver, setNodeRef } = useDroppable({ id: "trash" });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? "red" : "transparent",
        color: isOver ? "white" : "var(--primary)",
        padding: "8px",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FontAwesomeIcon icon={faTrash} className={styles.trashShift} />
    </div>
  );
};

/*
   MAIN SCHEDULER COMPONENT
*/

const Scheduler = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [chosenTeam, setChosenTeam] = useState("all");
  const [assignments, setAssignments] = useState({});
  const [addingUser, setAddingUser] = useState(false);
  const [addingShift, setAddingShift] = useState(false);
  const [departments, setDepartments] = useState({
    office: [],
    sales: [],
    service: [],
    cleaner: [],
    technician: [],
    all: [],
  });
  const [shifts, setShifts] = useState([]);

  //
  //LOAD DEPARTMENTS
  //
  useEffect(() => {
    const dpt = Object.keys(departments);
    const fetchDepartments = async () => {
      const dptKeys = Object.keys(departments);

      try {
        const promises = dptKeys.map((key) =>
          fetch(`/api/read/department/${key}`).then((res) => res.json())
        );

        const results = await Promise.all(promises);

        const newDepartments = {};

        results.forEach((data, index) => {
          const key = dptKeys[index];
          if (!data.success) {
            toast.error(data.message);
            return;
          }

          newDepartments[key] = data.department;
        });

        setDepartments(newDepartments);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load departments");
      }
    };
    fetchDepartments();
  }, [addingUser]);

  //
  //  LOAD SHIFTS
  //
  useEffect(() => {
    const getShifts = async () => {
      const response = await fetch("/api/read/shifts");
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setShifts(data.shifts);
    };
    getShifts();
  }, [addingShift]);

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

  //
  //   DRAG HANDLER
  //
  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    // const sourceCell = active.data?.current?.sourceCell;
    const { shiftID, sourceCell } = active.data.current || {};

    if (over.id === "trash" && sourceCell) {
      setAssignments((prev) => {
        const copy = { ...prev };
        delete copy[sourceCell];
        return copy;
      });
      return;
    }

    if (shiftID) {
      setAssignments((prev) => ({
        ...prev,
        [over.id]: shiftID,
      }));
    }
  };

  //
  //   RENDER COMPONENT
  //
  return (
    <div className={styles.schedulerMasterBlock}>
      <DndContext onDragEnd={handleDragEnd}>
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
            <button
              className={styles.addShiftButton}
              onClick={() => setAddingShift(!addingShift)}
            >
              {addingShift ? "Close" : "Add Shift"}
            </button>
            {addingShift && (
              <div className={styles.shiftFormMetaBlock}>
                <ShiftForm bool={setAddingShift} />
              </div>
            )}
          </div>
          {/* USER BAR */}
          <div className={styles.userBar}>
            <div className={styles.departmentSelect}>
              <select
                name="department"
                value={chosenTeam || ""}
                onChange={(e) => setChosenTeam(e.target.value)}
              >
                {/* <option value="all">--all departments--</option> */}
                {Object.entries(departments).map(([department], index) => (
                  <option value={department} key={index}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            {/* SHIFTS */}
            <div className={styles.shiftSelect}>
              {shifts?.map(({ id, title }) => (
                <DraggableShift
                  id={`shift-${id}`}
                  key={id}
                  data={{ shiftID: id }}
                >
                  {title}
                </DraggableShift>
              ))}
              <DroppableTrash />
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className={styles.theCal}>
          {chosenTeam && (
            <div className={styles.calMainBody}>
              <div className={styles.employeeList}>
                <div>Employees</div>
                {departments[chosenTeam].map(
                  ({ first_name, last_name }, index) => (
                    <div key={index} className={styles.employeeTile}>
                      <FontAwesomeIcon icon={faUser} /> {first_name} {last_name}
                    </div>
                  )
                )}
                <div className={styles.addEmployee}>
                  <button onClick={() => setAddingUser(!addingUser)}>
                    <FontAwesomeIcon icon={faUserPlus} />
                    Add Employee
                  </button>
                </div>
              </div>
              {/* DAYS */}
              {currentWeek.map((day, index) => (
                <div key={index} className={styles.dayCell}>
                  <div className={styles.dayHeader} key={index}>
                    {WEEKDAY[day.getDay()]},{" "}
                    {day.getDate() + suffix(day.getDate())}
                  </div>
                  {/* CELLS */}
                  {departments[chosenTeam].map(({ id: userID }) => {
                    const cellID = `${userID}|${
                      day.toISOString().split("T")[0]
                    }`;
                    return (
                      <DroppableCell
                        id={cellID}
                        key={cellID}
                        assignments={assignments}
                        shifts={shifts}
                      />
                    );
                  })}
                  <div className={styles.spacer}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DndContext>
      <div className={addingUser ? styles.addUserHere : styles.hideUserForm}>
        <RegisterForm bool={setAddingUser} />
      </div>
    </div>
  );
};

export default Scheduler;
