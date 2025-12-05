import styles from "./UserProfile.module.css";
import React, { useEffect, useState } from "react";
import { getUser } from "../../utils/API";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { text } from "@fortawesome/fontawesome-svg-core";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const get = async () => {
      const response = await getUser(id);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setUser(response.user);
      setFormData({
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        email: response.user.email,
        role: response.user.role,
        department: response.user.department,
      });
    };
    get();
  }, [id, editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      if (!confirm("Delete user?")) return;
    }

    const URL = editing
      ? `/api/update/user/${user.id}`
      : `/api/delete/user/${user.id}`;
    const HEADERS = {
      method: editing ? "PATCH" : "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (editing) {
      HEADERS.body = JSON.stringify(formData);
    }

    try {
      const response = await fetch(URL, HEADERS);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      if (!editing) {
        navigate("/scheduler");
      }
      setEditing(false);
    } catch (error) {
      console.error("[USER PROFILE ERROR]", error);
      toast.error(error.message);
    }
  };

  return (
    <form className={styles.userProfileBlock} onSubmit={handleSubmit}>
      <div className={styles.userButtonBlock}>
        <button type="button" onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit User"}
        </button>
        <button
          type="button"
          className={styles.deleteUserButton}
          onClick={handleSubmit}
          disabled={editing}
        >
          Delete User
        </button>
      </div>
      <div>
        <label htmlFor="first_name">First Name</label>
        {editing ? (
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        ) : (
          <span>{formData.first_name}</span>
        )}
      </div>
      <div>
        <label htmlFor="last_name">Last Name</label>
        {editing ? (
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        ) : (
          <span>{formData.last_name}</span>
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        {editing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        ) : (
          <span>{formData.email}</span>
        )}
      </div>
      <div>
        <label htmlFor="role">Role</label>
        {editing ? (
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        ) : (
          <span>{formData.role}</span>
        )}
      </div>
      <div>
        <label htmlFor="department">Department</label>
        {editing ? (
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="sales">Sales</option>
            <option value="service">Service</option>
            <option value="cleaner">Cleaner</option>
            <option value="technician">Technician</option>
            <option value="office">Office</option>
          </select>
        ) : (
          <span>{formData.department}</span>
        )}
      </div>
      {editing && <button type="submit">Submit</button>}
    </form>
  );
};

export default UserProfile;
