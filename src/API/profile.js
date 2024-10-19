import axios from "axios"

const PROFILE_API_URL = "http://localhost:5000/user/profile"

//export const getUser = async () => {
//  try {
//    const token = getAuthToken();
//    if (!token) {
//      return null;
//    }
//    const res = await axios.get(PROFILE_API_URL, {
//      headers: {
//        Authorization: `Bearer ${token}`
//      }
//    });
//    if (res.status == 200) return res.data;
//    else throw new Error("User not found or not authenticated")
//  }
//  catch (error) {
//    console.error(error.message);
//    return null;
//  }
//};

export const getUserById = async (id, token) => {
  try {
    const res = await axios.get(`${PROFILE_API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 200) {
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
    const res = await axios.patch(PROFILE_API_URL, { modified_user }, { headers: { Authorization: `Bearer ${modified_user.token}` } });
    if (res.status === 200) return res.data;
    else throw new Error("Could not modify user")
  }
  catch(error) {
    console.error(error.message);
    return null;
  }
}

export const deleteUser = async (user) => {
  try {
    const res = await axios.delete(
      `${PROFILE_API_URL}/${user._id}`,
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status !== 200) throw new Error("Could not delete user", user._id);
    else return true;
  }
  catch (error) {
    console.error(error.message);
    return false;
  }
}
