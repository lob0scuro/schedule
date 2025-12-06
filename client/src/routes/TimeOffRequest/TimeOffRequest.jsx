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
    other_reason: "",
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
    if (formData.reason.trim() === "") {
      toast.error("A reason is required");
      return;
    }
    if (!confirm("Submit time off request?")) return;

    const payload = {
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason:
        formData.reason === "other" ? formData.other_reason : formData.reason,
    };

    try {
      const response = await fetch("/api/create/time_off_request", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      console.error("[TIME OFF REQUEST ERROR]: ", error);
      toast.error(error.message);
    }
  };
  return (
    <div className={styles.timeOffRequestMasterBlock}>
      <h1>Time Off Request</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />
        </div>
        {/* RADIO REASON SWITCHES */}
        <h3 className={styles.reasonHeader}>Reason</h3>
        <div className={styles.reasonRadio}>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="vacation"
              checked={formData.reason === "vacation"}
              onChange={handleChange}
            />
            Vacation
          </label>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="personal"
              checked={formData.reason === "personal"}
              onChange={handleChange}
            />
            Personal Leave
          </label>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="funeral"
              checked={formData.reason === "funeral"}
              onChange={handleChange}
            />
            Funeral/Bereavement
          </label>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="jury-duty"
              checked={formData.reason === "jury-duty"}
              onChange={handleChange}
            />
            Jury Duty
          </label>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="family"
              checked={formData.reason === "family"}
              onChange={handleChange}
            />
            Family Reasons
          </label>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="medical"
              checked={formData.reason === "medical"}
              onChange={handleChange}
            />
            Medical Leave
          </label>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="voting"
              checked={formData.reason === "voting"}
              onChange={handleChange}
            />
            Voting
          </label>
          <label htmlFor="reason">
            <input
              type="radio"
              name="reason"
              value="other"
              checked={formData.reason === "other"}
              onChange={handleChange}
            />
            Other
          </label>
          {formData.reason === "other" && (
            <textarea
              name="other_reason"
              value={formData.other_reason}
              onChange={handleChange}
              placeholder="Please describe..."
            ></textarea>
          )}
        </div>
        <button type="submit">Submit Time Off Request</button>
      </form>
    </div>
  );
};

export default TimeOffRequest;
