import styles from "./RegisterForm.module.css";
import React, { useState } from "react";
import { ROLES, DEPARTMENT } from "../../utils/Schemas";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ bool }) => {
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
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
      if (bool) {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password1: "",
          password2: "",
          role: "employee",
          department: "",
        });
        bool(false);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("[REGISTRATION ERROR]: ", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className={bool ? styles.importUserForm : styles.registerFormMasterBlock}
    >
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            autoFocus
          >
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
        <div>
          <label htmlFor="password1">choose a password</label>
          <input
            type="password"
            name="password1"
            value={formData.password1}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password2">re-enter password</label>
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterForm;
