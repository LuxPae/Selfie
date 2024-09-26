import axios from "axios"

const EVENTS_API_URL = "http://localhost:5000/events"

// Fetch all events
export const getAllEvents = async () => {
  //try {
    const res = await axios.get(EVENTS_API_URL);
    if (res.status === 200) {
      return res.data; // Assuming the API returns the array of events directly
    } else {
      //throw new Error('Failed to fetch events');
      console.log("Failed to fetch events")
    }
  //} catch (error) {
  //  console.error('Failed to fetch events:', error.res ? error.res.data.message : error.message);
  //  return []; // Return an empty array in case of an error
  //}
};

// Fetch event by ID
export const getEventById = async (id) => {
  const res = await axios.get(`${EVENTS_API_URL}/${id}`);
  return res.data;
};

// Fetch events by label
export const getEventsByLabel = async (labels) => {
  return await axios.get(`${EVENTS_API_URL}/by-label`, { params: { labels } });
};

// Create a new event
export const createEvent = async (new_event) => {
  try {
    const res = await axios.post(EVENTS_API_URL, { new_event })
    //if (res.status == 201) return res.data;
    //else throw new Error("Could not create event")
    console.log("create event status:", res.status)
    return res.data
  }
  catch(error) {
    console.error(error.message);
    return null;
  }
};

// Update an event
export const modifyEvent = async (id, modified_event) => {
  try {
    const res = await axios.patch(`${EVENTS_API_URL}/${id}`, modified_event);
    if (res.status == 200) return res.data;
    else throw new Error("Could not modify event")
  }
  catch (error) {
    console.error(error.message);
    return null;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  return await axios.delete(`${EVENTS_API_URL}/${id}`);
};
