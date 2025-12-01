import styles from "./Scheduler.module.css";
import React, { useState } from "react";
import {
  WEEKDAY,
  MONTH_NAMES,
  getWorkWeekFromDate,
  CLEANERS,
  DRYER_RANGE_TECHS,
  FRIDGE_TECHS,
  OFFICE,
  SALES,
  SERVICE,
  WASHER_TECHS,
  suffix,
  convertTime,
} from "../../utils/Helpers";
import { SHIFTS } from "../../utils/Schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBackwardStep,
  faForwardStep,
  faTrash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const EMPLOYEES = {
  cleaners: CLEANERS,
  office: OFFICE,
  sales: SALES,
  service: SERVICE,
  technicians: [...WASHER_TECHS, ...FRIDGE_TECHS, ...DRYER_RANGE_TECHS],
  all: [
    ...CLEANERS,
    ...OFFICE,
    ...SALES,
    ...SERVICE,
    ...WASHER_TECHS,
    ...FRIDGE_TECHS,
    ...DRYER_RANGE_TECHS,
  ],
};

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

const DroppableCell = ({ id, assignments }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const assignedKey = assignments?.[id];
  const assignedShift = assignedKey ? SHIFTS[assignedKey] : null;

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
          data={{ shiftName: assignedKey, sourceCell: id }}
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

const Scheduler = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [chosenTeam, setChosenTeam] = useState("all");
  const [assignments, setAssignments] = useState({});

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

  // Prev / Next / Today handlers
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

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const sourceCell = active.data?.current?.sourceCell;
    const shiftName =
      active.data?.current?.shiftName || active.id.replace("shift-", "");

    if (over.id === "trash" && sourceCell) {
      setAssignments((prev) => {
        const newAssignments = { ...prev };
        delete newAssignments[sourceCell];
        return newAssignments;
      });
      return;
    }

    setAssignments((prev) => ({
      ...prev,
      [over.id]: shiftName,
    }));
  };

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
            <button className={styles.addShiftButton}>Add Shift</button>
          </div>

          <div className={styles.userBar}>
            <div className={styles.departmentSelect}>
              <select
                name="department"
                value={chosenTeam || ""}
                onChange={(e) => setChosenTeam(e.target.value)}
              >
                <option value="all">--all departments--</option>
                {Object.entries(EMPLOYEES).map(([department], index) => (
                  <option value={department} key={index}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.shiftSelect}>
              {Object.keys(SHIFTS).map((shift) => (
                <DraggableShift id={`shift-${shift}`} key={shift}>
                  {shift}
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
                {EMPLOYEES[chosenTeam].map(({ name }, index) => (
                  <div key={index} className={styles.employeeTile}>
                    <FontAwesomeIcon icon={faUser} /> {name}
                  </div>
                ))}
                <div className={styles.addEmployee}>
                  <button>
                    <FontAwesomeIcon icon={faUserPlus} />
                    Add Employee
                  </button>
                </div>
              </div>
              {currentWeek.map((day, index) => (
                <div key={index} className={styles.dayCell}>
                  <div className={styles.dayHeader} key={index}>
                    {WEEKDAY[day.getDay()]},{" "}
                    {day.getDate() + suffix(day.getDate())}
                  </div>
                  {/* Render shifts here */}
                  {EMPLOYEES[chosenTeam].map(({ name }, empIndex) => {
                    const cellID = `${name}|${day.toISOString().split("T")[0]}`;
                    return (
                      <DroppableCell
                        id={cellID}
                        key={empIndex}
                        assignments={assignments}
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
    </div>
  );
};

export default Scheduler;
