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
  const [selectedUser, setSelectedUser] = useState({});
  const [currentWeek, setCurrentWeek] = useState(getWorkWeekFromDate(today));
  const [schedule, setSchedule] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/read/user/${id}`);
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setSelectedUser(data.user);
    };
    getUser();
  }, [id]);

  useEffect(() => {
    const start = formatDate(currentWeek[0]);
    const end = formatDate(currentWeek[currentWeek.length - 1]);
    const scheduleGet = async () => {
      const res = await fetch(
        `/api/read/schedule_week/${selectedUser.id}?start_date=${start}&end_date=${end}`
      );
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
      }
      setSchedule(data.schedule);
    };
    scheduleGet();
  }, [id, user, currentWeek, activeIndex]);

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

  const handleNote = async (id) => {
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
          {schedule.map((day, index) => (
            <div key={index} className={styles.weekdayItem}>
              <div className={styles.weekdayHeader}>
                <span>
                  {WEEKDAY[index + 1]} {convertDate(day.shift_date)}
                </span>
                {user.role === "admin" && (
                  <FontAwesomeIcon
                    icon={faNoteSticky}
                    onClick={() =>
                      activeIndex === index
                        ? setActiveIndex(null)
                        : setActiveIndex(index)
                    }
                  />
                )}
              </div>
              <div className={styles.weekdayBody}>
                {day.shift.start_time !== null ? (
                  <p>
                    {convertTime(day.shift.start_time)} -{" "}
                    {convertTime(day.shift.end_time)}
                  </p>
                ) : (
                  <p>OFF</p>
                )}
                <small>{locale[day.location]}</small>
                {day.note && <p>{day.note}</p>}
                {activeIndex === index && (
                  <>
                    <textarea
                      name="content"
                      id="content"
                      value={content}
                      className={styles.contentForm}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button
                      className={styles.submitContentButton}
                      onClick={() => handleNote(day.id)}
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
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
