import toast from "react-hot-toast";
import styles from "./TimeOffStatus.module.css";
import React, { useEffect, useState } from "react";
import { convertDate } from "../../../utils/Helpers";

const TimeOffStatus = () => {
  const [ro, setRo] = useState({
    pending: [],
    approved: [],
    denied: [],
  });
  const [statusChanges, setStatusChanges] = useState(0);

  useEffect(() => {
    const getRequestOffs = async () => {
      const response = await fetch("/api/read/time_off_requests");
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setRo({
        pending: [...data.time_off_requests.pending],
        approved: [...data.time_off_requests.approved],
        denied: [...data.time_off_requests.denied],
      });
    };

    getRequestOffs();
  }, [statusChanges]);

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
    setStatusChanges((prev) => prev + 1);
    toast.success(data.message);
  };

  return (
    <div className={styles.timeOffStatusMasterBlock}>
      <h2>Time Off Requests</h2>
      <div>
        <p>Pending Requests</p>
        <ul className={styles.pendingList}>
          {ro.pending.length !== 0 ? (
            ro.pending.map(
              ({ id, user, status, reason, start_date, end_date }) => (
                <li key={id}>
                  <div>
                    <h4>
                      {user.first_name} {user.last_name}.
                    </h4>
                    <p>Start Date: {convertDate(start_date)}</p>
                    <p>End Date: {convertDate(end_date)}</p>
                    <p>reason: {reason}</p>
                  </div>
                  <div>
                    <button onClick={() => handleUpdate(id, "approved")}>
                      Approve
                    </button>
                    <button
                      className={styles.denyRequest}
                      onClick={() => handleUpdate(id, "denied")}
                    >
                      Deny
                    </button>
                  </div>
                </li>
              )
            )
          ) : (
            <li className={styles.noRequests}>
              <p>No Pending Requests</p>
            </li>
          )}
        </ul>
      </div>
      <div>
        <p>Approved Requests</p>
        <ul className={styles.approvedList}>
          {ro.approved.length !== 0 ? (
            ro.approved.map(
              ({ id, user, status, reason, start_date, end_date }) => (
                <li key={id}>
                  <div>
                    <h4>
                      {user.first_name} {user.last_name}.
                    </h4>
                    <p>reason: {reason}</p>
                    <p>Start Date: {convertDate(start_date)}</p>
                    <p>End Date: {convertDate(end_date)}</p>
                  </div>
                  <div>
                    <button
                      className={styles.denyRequest}
                      onClick={() => handleUpdate(id, "denied")}
                    >
                      Deny
                    </button>
                  </div>
                </li>
              )
            )
          ) : (
            <li className={styles.noRequests}>
              <p>No Approved Requests</p>
            </li>
          )}
        </ul>
      </div>
      <div>
        <p>Denied Requests</p>
        <ul className={styles.deniedList}>
          {ro.denied.length !== 0 ? (
            ro.denied.map(
              ({ id, user, status, reason, start_date, end_date }) => (
                <li key={id}>
                  <div>
                    <h4>
                      {user.first_name} {user.last_name}.
                    </h4>
                    <p>reason: {reason}</p>
                    <p>Start Date: {convertDate(start_date)}</p>
                    <p>End Date: {convertDate(end_date)}</p>
                  </div>
                  <div>
                    <button onClick={() => handleUpdate(id, "approved")}>
                      Approve
                    </button>
                  </div>
                </li>
              )
            )
          ) : (
            <li className={styles.noRequests}>
              <p>No Denied Requests</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TimeOffStatus;
