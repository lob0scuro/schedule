import styles from "./RegisterForm.module.css";
import React, { useState } from "react";
import { ROLES, DEPARTMENT } from "../../utils/Schemas";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password1: "",
    password2: "",
    role: "employee",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.registerFormMasterBlock}>
      <h2>Registration</h2>
      <form>
        <div>
          <label htmlFor="role">Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">--select role--</option>
            {Object.entries(ROLES).map(([key, value], index) => (
              <option value={key} key={index}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="department">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">--select department--</option>
            {Object.entries(DEPARTMENT).map(([key, value], index) => (
              <option value={key} key={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterForm;
