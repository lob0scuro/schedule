import toast from "react-hot-toast";
import styles from "./TimeOffStatus.module.css";
import React, { useEffect, useState } from "react";

const TimeOffStatus = () => {
  const [requestOffs, setRequestOffs] = useState([]);

  useEffect(() => {
    const getRequestOffs = async () => {
      const response = await fetch("/api/read/time_off_requests");
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        setRequestOffs(null);
        return;
      }
      setRequestOffs(data.time_off_requests);
    };

    getRequestOffs();
  }, []);

  const handleUpdate = async (userID, newStatus) => {
    const response = await fetch(
      `/api/update/time_off_request/${userID}/${newStatus}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
  };

  return (
    <div className={styles.timeOffStatusMasterBlock}>
      <h2>Time Off Requests</h2>
      <div>
        <p>Pending Requests</p>
        <ul className={styles.pendingList}>
          {requestOffs
            .filter((r) => r.status === "pending")
            .map(({ id, user, status, reason }) => (
              <li key={id}>
                <div>
                  <p>status: {status}</p>
                  <p>reason: {reason}</p>
                  <p>
                    <small>
                      {user.first_name} {user.last_name[0]}.
                    </small>
                  </p>
                </div>
                <div>
                  <button onClick={() => handleUpdate(id, "approved")}>
                    Approve
                  </button>
                  <button onClick={() => handleUpdate(id, "denied")}>
                    Deny
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeOffStatus;
