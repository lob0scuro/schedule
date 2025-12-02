import styles from "./TimeOffRequest.module.css";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TimeOffRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/create/time_off_request", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
    <div className={styles.timeOffMasterBlock}>
      <h2>Time Off Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="reason">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default TimeOffRequest;
