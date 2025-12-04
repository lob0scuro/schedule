import styles from "./ShiftForm.module.css";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ShiftForm = ({ bool, ...props }) => {
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
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
      const response = await fetch("/api/create/shift", {
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
      setFormData({
        title: "",
        end_time: "",
        start_time: "",
      });
      bool(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
    <div className={styles.shiftFormMasterBlock}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Shift Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ShiftForm;
