import { useState, useReducer } from "react"
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
  const [ selectedDay, setSelectedDay ] = useState(currentDate);

  const [ allEvents, setAllEvents ] = useState([]);

  const more_than_one_day_dates = (begin, end, total) => {
    var dates = []
    for (let i = 0; i < total; i++) {
      const current = {
        begin: (() => {
          if (i === 0) return begin.valueOf()
          else return begin.add(i, "day").startOf("day").valueOf()
        })(),
        end: (() => {
          if (i === total-1) return end.valueOf()
          else return begin.add(i, "day").endOf("day").valueOf()
        })(),
        allDay: (() => i !== 0 && i !== total-1)()
      }
      dates.push(current)
    }
    return dates
  }

  const [multipleDaysEvents, setMultipleDaysEvents] = useState([])
  const clearMultipleEvents = (events) => {
    setMultipleDaysEvents([])
    const cleared_events = events.filter(e => !e.lastsMoreDays || e.lastsMoreDays?.num === 1)
    return cleared_events
  }
  const createMultipleDaysEvents = (events) => {
    var all_events = clearMultipleEvents(events)
    var md_events = []
    for (let event of all_events) {
      if (event.lastsMoreDays) {
        md_events.push({...event})
        const dates = more_than_one_day_dates(dayjs(event.begin), dayjs(event.end), event.lastsMoreDays.total)
        if (dates.length !== event.lastsMoreDays.total) console.error("What the HEEEEEELL");
        //console.log("dates", dates)
        event = {
          ...event,
          begin: dates[0].begin.valueOf(),
          end: dates[0].end.valueOf(),
          allDay: dates[0].allDay,
        }
        //console.log("First day", event)
        for (let i = 1; i < event.lastsMoreDays.total; i++) {
          let e = {
            ...event,
            begin: dates[i].begin.valueOf(),
            end: dates[i].end.valueOf(),
            allDay: dates[i].allDay,
            lastsMoreDays: {
              num: i+1,
              total: event.lastsMoreDays.total
            }
          }
          const index = all_events.findIndex(evt => evt._id === e._id && evt.lastsMoreDays.num === e.lastsMoreDays.num)
          if (index === -1) all_events.push(e)
        }
      }
    }
    //console.log("Multiple days events:", md_events)
    setMultipleDaysEvents(md_events)
    return all_events
  }

  const allEvents_initialize = () => {
    if (allEvents.length > 0) return;
    getAllEvents(user)
      .then(events => {
        const all_events = createMultipleDaysEvents(events)
        setAllEvents(all_events)
    }).catch(error => {
        console.error(error.message)
    })
  }

  const allEvents_createEvents = (events) => {
    var new_events = [...allEvents, ...events]
    const allNewEvents = createMultipleDaysEvents(new_events)
    setAllEvents(allNewEvents);
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
    const allUpdatedEvents = createMultipleDaysEvents(updatedEvents)
    setAllEvents(allUpdatedEvents)
  }

  const allEvents_deleteEvents = (events) => {
    var new_events = [...allEvents]
    for (let i = 0; i < events.length; i++) {
      new_events = new_events.filter(e => e._id !== events[i]._id);
    }
    setAllEvents(new_events)
  }

  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const [ isCreatingNewEvent, setIsCreatingNewEvent ] = useState(false);
  const [ showEventModal, setShowEventModal ] = useState(false);
  const [ showEventsList, setShowEventsList ] = useState(false);
  const [ duplicatedEvent, setDuplicatedEvent ] = useState(null)

  const [ newFullName, setNewFullName ] = useState("");
  const [ newUsername, setNewUsername ] = useState("");
  const [ newPicture, setNewPicture ] = useState("");
  const [ newBio, setNewBio ] = useState("");

  const [ currentNotification, setCurrentNotification ] = useState(null)
  const [ showNotification, setShowNotification ] = useState(false);
  const [ pendingNotifications, setPendingNotifications ] = useState([])
  const notify = (notifications) => {
    setShowNotification(true)
    const new_pending_notifications = [...pendingNotifications, ...notifications]
    //console.log("Added notifications", notifications)
    //console.log("All pendingNotifications", new_pending_notifications)
    setPendingNotifications(new_pending_notifications)
  }


  const [ modifyRepeated, setModifyRepeated] = useState(false)

  const [ filters, setFilters ] = useState({ white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true })

  const [ shownCalendarType, setShownCalendarType ] = useState("tutti")

  const [ showCompletedTasks, setShowCompletedTasks ] = useState(false)

  return (
    <GlobalContext.Provider value={{
      user,
      dispatchUser,

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
      setAllEvents,
      allEvents_initialize,
      allEvents_createEvents,
      allEvents_modifyEvents,
      allEvents_deleteEvents,
      multipleDaysEvents,

      showEventModal,
      setShowEventModal,
      showEventsList,
      setShowEventsList,
      selectedEvent,
      setSelectedEvent,
      isCreatingNewEvent,
      setIsCreatingNewEvent,
      duplicatedEvent,
      setDuplicatedEvent,

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
  )
}
