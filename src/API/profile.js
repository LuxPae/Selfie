import axios from "axios"
import { getAuthToken } from "../scripts/authentication.js"

const PROFILE_API_URL = "http://localhost:5000/user/profile"

export const getUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }
    const res = await axios.get(PROFILE_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status == 200) return res.data;
    else throw new Error("User not found or not authenticated")
  }
  catch (error) {
    console.error(error.message);
    return null;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${PROFILE_API_URL}/${id}`);
    if (res.status == 200) {
      console.log("Found user with id "+id+":", res.data)
      return res.data;
    }
    else throw new Error("user not found");
  }
  catch (error) {
    console.error(error.message);
    return null;
  }
}

export const modifyUser = async (modified_user) => {
  try {
    //console.log("modifying user:", modified_user);
    const res = await axios.patch(PROFILE_API_URL, { modified_user });
    if (res.status == 204) return res.data;
    else throw new Error("Could not modify user")
  }
  catch(error) {
    console.error(error.message);
    return null;
  }
}

export const deleteUser = async (id) => {
  try {
    console.log("Deleting user", id);
    const res = await axios.delete(`${PROFILE_API_URL}/${id}`);
    if (res.status != 204) throw new Error("Could not delete user", id);
  }
  catch (error) {
    console.error(error.message);
  }
}
