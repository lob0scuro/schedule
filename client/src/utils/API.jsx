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
