import { useState, useEffect, useReducer } from "react"
import dayjs from "dayjs"
import GlobalContext from "./GlobalContext.js"


function savedEventsReducer(current_state, { action, event }) {
  //console.log("Reducing events:", current_state);
  //console.log(" > action:", action);
  //console.log(" > Event to dispatch:", event);

  switch (action) {
    case 'create':
      return [...current_state, event];
    case 'modify':
      // Find the index of the event to update
      const index = current_state.findIndex(e => e._id === event._id);
      if (index !== -1) {
        // If the event exists, update it
        const updatedEvents = [...current_state];
        updatedEvents[index] = event;
        return updatedEvents;
      }
      else {
        // If the event doesn't exist, add it
        return [...current_state, event];
      }
    case 'delete':
      return current_state.filter(e => e._id !== event._id);
    case 'reset':
      return event;  // Resets the current_state to the event
    default:
      return current_state;  // Returns current current_state for unhandled action actions
  }
}

export default function ContextWrapper(props)
{
  const [ user, setUser ] = useState({
    _id: 0,
    fullName: "",
    username: "",
    password: "",
    picture: "",
    bio: ""
  });

  const [ currentDate, setCurrentDate ] = useState(dayjs());
  const [ selectedDay, setSelectedDay ] = useState(dayjs());

  const [ savedEvents, dispatchEvent ] = useReducer(savedEventsReducer, []);
  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const [ showEventModal, setShowEventModal ] = useState(false);
  const [ showEventsList, setShowEventsList ] = useState(false);


  const [ newUser, setNewUser ] = useState({ ...user });
  //TODO poi da togliere, forse
  const [ newFullName, setNewFullName ] = useState("");
  const [ newUsername, setNewUsername ] = useState("");
  const [ newPicture, setNewPicture ] = useState("" );
  const [ newBio, setNewBio ] = useState("");

  return (
    <GlobalContext.Provider value={{
      user,
      setUser,
      //TODO togliere?
      newFullName,
      setNewFullName,
      newUsername,
      setNewUsername,
      newPicture,
      setNewPicture,
      newBio,
      setNewBio,

      currentDate,
      setCurrentDate,
      selectedDay,
      setSelectedDay,

      savedEvents,
      dispatchEvent,
      showEventModal,
      setShowEventModal,
      showEventsList,
      setShowEventsList,
      selectedEvent,
      setSelectedEvent,
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}
