import { useState, useEffect, useReducer } from "react"
import dayjs from "dayjs"
import GlobalContext from "./GlobalContext.js"
import AuthContext from "./AuthContext.js"

const authReducer = (state, { type, payload }) => {
  //console.log("Dispatching user: ");
  //console.log("Type:", type);
  //console.log("Payload:", payload);
  switch (type) {
    case "REGISTER": 
    case "LOGIN": 
    case "MODIFY": 
      localStorage.setItem("user", JSON.stringify({ ...payload }));
      return { ...payload };

    case "LOGOUT": 
    case "DELETE":
      localStorage.removeItem("user");
      return null;

    default: return state;
  }
};

function eventsReducer(state, { type, payload }) {
  //console.log("Reducing events:", state);
  //console.log(" > type:", type);
  //console.log(" > Event to dispatch:", payload);

  switch (type) {
    case "CREATE": return [...state, payload];
    case "MODIFY": {
      const index = state.findIndex(e => e._id === payload._id);
      if (index !== -1) {
        const updatedEvents = [...state];
        updatedEvents[index] = payload;
        return updatedEvents;
      }
      else return [...state, payload];
    }
    case "DELETE": return state.filter(e => e._id !== payload._id);
    case "ALL":
      return payload;  
    default: return state;
  }
}

export default function ContextWrapper({ children })
{
  //prima era authReducer, { user: null}, ma perché un oggetto con user dentro? è già assegnaato a user, non capisco
  const [user, dispatchUser] = useReducer(authReducer, null);

  const [ currentDate, setCurrentDate ] = useState(dayjs());
  const [ selectedDay, setSelectedDay ] = useState(dayjs());

  const [ allEvents, dispatchEvent ] = useReducer(eventsReducer, []);
  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const [ showEventModal, setShowEventModal ] = useState(false);
  const [ showEventsList, setShowEventsList ] = useState(false);


  const [ newUser, setNewUser ] = useState(null);
  //TODO poi da togliere, forse
  const [ newFullName, setNewFullName ] = useState("");
  const [ newUsername, setNewUsername ] = useState("");
  const [ newPicture, setNewPicture ] = useState("");
  const [ newBio, setNewBio ] = useState("");

  const [ notification, setNotification ] = useState(null)
  const [ showNotification, setShowNotification ] = useState(false);
  const notify = (type, message) => {
    const notification = { type, message };
    setNotification(notification);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  }

  useEffect(() => {
    const ls_user = JSON.parse(localStorage.getItem("user"));
    if (ls_user) {
      dispatchUser({ type: "LOGIN", payload: ls_user });
    }
  }, []);

  return (
    <>
    <AuthContext.Provider value={{ user, dispatchUser }}>
      <GlobalContext.Provider value={{
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

        allEvents,
        dispatchEvent,
        showEventModal,
        setShowEventModal,
        showEventsList,
        setShowEventsList,
        selectedEvent,
        setSelectedEvent,

        notification,
        setNotification,
        showNotification,
        setShowNotification,
        notify,
      }}>
        {children}
      </GlobalContext.Provider>
    </AuthContext.Provider>
    </>
  );
}
