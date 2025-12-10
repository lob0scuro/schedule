import styles from "./ViewSchedule.module.css";
import { useAuth } from "../../../context/AuthContext";
import { getSchedules } from "../../../utils/API";
import {
  getWorkWeekFromDate,
  MONTH_NAMES,
  formatDate,
  convertDate,
  convertTime,
  WEEKDAY,
  locationAbbr,
  parseLocalDate,
} from "../../../utils/Helpers";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faNoteSticky,
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
import clsx from "clsx";
import { useParams } from "react-router-dom";

const locale = {
  lake_charles: "Lake Charles",
  jennings: "Jennings",
};

const ViewSchedule = () => {
  const today = new Date();
  const { user } = useAuth();
  const { id } = useParams();
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [selectedUser, setSelectedUser] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const start = formatDate(currentWeek[0]);
    const end = formatDate(currentWeek[currentWeek.length - 1]);
    const scheduleGet = async () => {
      const res = await fetch(
        `/api/read/user_schedule/${id}?start_date=${start}&end_date=${end}`
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
      }
      setSelectedUser(data.user);
      setSchedule(data.schedule);
    };
    scheduleGet();
  }, [id, user, currentWeek, activeIndex]);

  // FORMATTING
  const getWeekHeader = () => {
    const start = currentWeek[0];
    const end = currentWeek[currentWeek.length - 1];
    const startMonth = MONTH_NAMES[start.getMonth()];
    const endMonth = MONTH_NAMES[end.getMonth()];
    return startMonth === endMonth
      ? `${startMonth} ${start.getDate()} - ${end.getDate()}`
      : `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  };

  //WEEK DAY LABEL
  const getWeekdayHeader = (shiftDateStr) => {
    const dateObj = parseLocalDate(shiftDateStr);

    const index = currentWeek.findIndex(
      (d) =>
        d.getFullYear() === dateObj.getFullYear() &&
        d.getMonth() === dateObj.getMonth() &&
        d.getDate() === dateObj.getDate()
    );

    if (index === -1) return "";

    return WEEKDAY[index];
  };

  // Helper: Build Mon-Sat week from a Monday
  const buildWeekFromMonday = (monday) => {
    const week = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
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

  const handleNote = async (id) => {
    if (content.trim() === "") {
      toast.error("Content is required");
      return;
    }
    if (!confirm("Add note to shift?")) return;
    try {
      const response = await fetch(`/api/create/schedule_note/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: content }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      setContent("");
      setActiveIndex(null);
    } catch (error) {
      console.error("[NOTE SUBMISSION ERROR] ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.viewHeader}>
        <div>
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
        <h1>
          {selectedUser.first_name} {selectedUser.last_name}
          <br />
          {getWeekHeader()}
        </h1>
      </div>
      {schedule.length !== 0 ? (
        <div className={styles.userScheduleView}>
          {schedule.map(
            (
              { id, user_id, shift_id, shift_date, location, shift, note },
              index
            ) => (
              <div className={styles.shiftDay}>
                <div className={styles.shiftDayHeader}>
                  <h3>
                    {getWeekdayHeader(shift_date)} <br />{" "}
                    <span>{convertDate(shift_date)}</span>
                  </h3>
                  {user.role === "admin" && (
                    <FontAwesomeIcon
                      icon={faNoteSticky}
                      onClick={() =>
                        setActiveIndex(activeIndex === index ? null : index)
                      }
                    />
                  )}
                </div>
                <div className={styles.shiftDayBody}>
                  <p>
                    <span>{convertTime(shift.start_time)}</span> -{""}
                    <span>{convertTime(shift.end_time)}</span>
                  </p>
                  <p className={styles.locationTag}>{locale[location]}</p>
                  {note && <p className={styles.shiftNote}>{note}</p>}
                </div>
                {activeIndex === index && (
                  <div className={styles.shiftDayNoteForm}>
                    <textarea
                      name="content"
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button type="button" onClick={() => handleNote(id)}>
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        <div className={styles.noSchedule}>
          <p>Schedule not set yet</p>
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;
