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
import toast from "react-hot-toast";
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

const SchedulerBeta = () => {
  const today = new Date();
  const [departments, setDepartments] = useState({
    sales: [],
    service: [],
    cleaners: [],
    technicians: [],
    office: [],
  });
  const [shifts, setShifts] = useState([]);

  return (
    <div className={styles.schedulerMaster}>
      <div className={styles.controlBar}>
        <div className={styles.cbRow1}>
          <p>{today.getFullYear()}</p>
        </div>
        <div className={styles.cbRow2}></div>
      </div>
    </div>
  );
};

export default SchedulerBeta;
