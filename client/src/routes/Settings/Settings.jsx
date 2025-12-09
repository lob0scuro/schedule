import styles from "./Settings.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { convertTime } from "../../utils/Helpers";
import ShiftForm from "../../components/Shift/ShiftForm";
import RegisterForm from "../../components/Register/RegisterForm";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [department, setDepartment] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const getShifts = async () => {
      const res = await fetch("/api/read/shifts");
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setShifts(data.shifts);
    };
    getShifts();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch(`/api/read/department/${department}`);
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setUsers(data.department);
    };
    getUsers();
  }, [department]);

  const handleDelete = async (id, item) => {
    if (!confirm(`Delete this ${item}?`)) return;
    const route = `/api/delete/${item}/${id}`;

    try {
      const response = await fetch(route, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
    } catch (error) {
      console.error("[DELETION ERROR]: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.settingContainer}>
      <div className={styles.shiftSettings}>
        <ShiftForm />
        <h2>Shifts</h2>
        {shifts
          .filter((s) => s.id !== 9999 && s.id !== 9998)
          .map(({ id, title, start_time, end_time }, index) => (
            <div className={styles.shiftItem} key={index}>
              <h3>{title}</h3>
              <p>
                <span>
                  {convertTime(start_time)} - {convertTime(end_time)}
                </span>
              </p>
              <button
                className={styles.deleteItemButton}
                onClick={() => handleDelete(id, "shift")}
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </button>
            </div>
          ))}
        <br />
      </div>
      <div className={styles.userSettings}>
        <RegisterForm bool />
        <h2>Users</h2>
        <select
          name="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">--select department--</option>
          {["cleaner", "technician", "service", "sales", "office"].map(
            (item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            )
          )}
        </select>
        {users.map(
          ({ id, first_name, last_name, email, role, department }, index) => (
            <div
              className={styles.userItem}
              key={index}
              onClick={() => navigate(`/user/${id}`)}
            >
              <h3>
                {first_name} {last_name}
              </h3>
              <div>
                <p>
                  Email <span>{email}</span>
                </p>
                <p>
                  Role <span>{role}</span>
                </p>
                <p>
                  Department <span>{department}</span>
                </p>
              </div>
              <button
                className={styles.deleteItemButton}
                onClick={() => handleDelete(id, "user")}
              >
                <FontAwesomeIcon icon={faDeleteLeft} />
              </button>
            </div>
          )
        )}
        <br />
      </div>
    </div>
  );
};

export default Settings;
