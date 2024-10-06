import axios from "axios"

const EVENTS_API_URL = "http://localhost:5000/events"

export const getAllEvents = async (user) => {
  try {
    const res = await axios.get(
      `${EVENTS_API_URL}/${user._id}`,
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status === 200) {
      return res.data; 
    } else {
      throw new Error('Failed to fetch events');
      console.log("Failed to fetch events")
    }
  } catch (error) {
    console.error('Failed to fetch events:', error.res ? error.res.data.message : error.message);
    return [];
  }
};

export const createEvent = async(event, user) => {
  console.log("Creating event", event);
  try {
    const res = await axios.post(
      `${EVENTS_API_URL}/${user._id}`,
      { ...event },
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status === 201) return res.data;
    else throw new Error("Failed to create event");
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export const modifyEvent = async (modified_event, user) => {
  try {
    const res = await axios.patch(
      `${EVENTS_API_URL}/${modified_event._id}`,
      { modified_event },
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status === 200) return res.data;
    else throw new Error("Could not modify event")
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export const deleteEvent = async (event, user) => {
  try {
    const res = await axios.delete(
      `${EVENTS_API_URL}/${event._id}`,
      { headers: { Authorization: `Bearer ${user.token}` }}
    );
    if (res.status !== 204) throw new Error("Could not delete event", event._id);
  } catch (error) {
    console.error(error.message);
  }
}
