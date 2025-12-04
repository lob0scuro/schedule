export const getShifts = async () => {
  try {
    const response = await fetch("/api/read/shifts");
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return { success: true, shifts: data.shifts };
  } catch (error) {
    console.error("[SHIFT QUERY ERROR]: ", error);
    return { success: false, message: error.message };
  }
};

export const getSchedules = async () => {
  try {
    const response = await fetch("/api/read/schedules");
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return { success: true, schedules: data.schedules };
  } catch (error) {
    console.error("[SCHEDULE QUERY ERROR]: ", error);
    return { success: false, message: error.message };
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch("/api/read/users");
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return { success: true, users: data.users };
  } catch (error) {
    console.error("[USERS QUERY ERROR]: ", error);
    return { success: false, message: error.message };
  }
};

export const getUser = async (id) => {
  try {
    const response = await fetch(`/api/read/user/${id}`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return { success: true, user: data.user };
  } catch (error) {
    console.error("[USER QUERY ERROR]: ", error);
    return { success: false, message: error.message };
  }
};
