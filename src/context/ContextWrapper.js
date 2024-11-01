import { useState, useReducer, useEffect } from "react"
import dayjs from "dayjs"
import GlobalContext from "./GlobalContext.js"
import { getAllEvents } from "../API/events.js"

const userReducer = (state, { type, payload }) => {
  //console.log("Dispatching user: ");
  //console.log("Type:", type);
  //console.log("Payload:", payload);
  switch (type) {
    case "REGISTER": 
    case "LOGIN": 
    case "SET":
    case "MODIFY": 
      return payload;

    case "LOGOUT": 
    case "DELETE":
      return null;

    default: return state;
  }
};

export default function ContextWrapper({ children })
{
  const [user, dispatchUser] = useReducer(userReducer, null);

  const [ currentDate, setCurrentDate ] = useState(dayjs());
  const [calendarDate, setCalendarDate] = useState(currentDate.startOf("month"))
  const [ selectedDay, setSelectedDay ] = useState(dayjs());

  const [ allEvents, setAllEvents ] = useState([]);

  const allEvents_initialize = () => {
    if (allEvents.length > 0) return;
    getAllEvents(user)
      .then(events => {
        setAllEvents(events)
    }).catch(error => {
        console.error(error.message)
    })
  }
  const allEvents_createEvents = (events) => {
    var new_events = [...allEvents, ...events]
    setAllEvents(new_events);
  }
  const allEvents_modifyEvents = (events) => {
    var updatedEvents = [...allEvents]
    for (let i = 0; i < events.length; i++) {
      const index = allEvents.findIndex(e => e._id === events[i]._id);
      if (index !== -1) {
        updatedEvents[index] = events[i];
      }
      else updatedEvents.push(events[i]);
    }
    setAllEvents(updatedEvents)
  }
  const allEvents_deleteEvents = (events) => {
    var new_events = [...allEvents]
    for (let i = 0; i < events.length; i++) {
      new_events = new_events.filter(e => e._id !== events[i]._id);
    }
    setAllEvents(new_events)
  }

  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const [ showEventModal, setShowEventModal ] = useState(false);
  const [ showEventsList, setShowEventsList ] = useState(false);

  const [ newUser, setNewUser ] = useState(null);
  //TODO poi da togliere, forse
  const [ newFullName, setNewFullName ] = useState("");
  const [ newUsername, setNewUsername ] = useState("");
  const [ newPicture, setNewPicture ] = useState("");
  const [ newBio, setNewBio ] = useState("");

  const [ currentNotification, setCurrentNotification ] = useState(null)
  const [ showNotification, setShowNotification ] = useState(false);
  const [ pendingNotifications, setPendingNotifications ] = useState([])

  const notify = (type, message) => {
    const notification = { type, message };
    const new_arr = pendingNotifications.splice(0, 0, notification);
    //console.log("pendingNotifications:", pendingNotifications)
    setPendingNotifications(new_arr)
  }

  //https://stackoverflow.com/questions/63143315/how-to-call-a-function-every-x-seconds-with-updated-state-react

  const [ modifyRepeated, setModifyRepeated] = useState(false);

  const [ filters, setFilters ] = useState({ white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true })

  const [ shownCalendarType, setShownCalendarType ] = useState("tutti");

  const [ showCompletedTasks, setShowCompletedTasks ] = useState(false)

  return (
    <GlobalContext.Provider value={{
      user,
      dispatchUser,

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
      calendarDate,
      setCalendarDate,
      selectedDay,
      setSelectedDay,

      allEvents,
      allEvents_initialize,
      allEvents_createEvents,
      allEvents_modifyEvents,
      allEvents_deleteEvents,

      showEventModal,
      setShowEventModal,
      showEventsList,
      setShowEventsList,
      selectedEvent,
      setSelectedEvent,

      currentNotification,
      setCurrentNotification,
      showNotification,
      setShowNotification,
      pendingNotifications,
      setPendingNotifications,
      notify,

      modifyRepeated,
      setModifyRepeated,

      filters,
      setFilters,

      shownCalendarType,
      setShownCalendarType,

      showCompletedTasks,
      setShowCompletedTasks
    }}>
      {children}
    </GlobalContext.Provider>
  );
}
