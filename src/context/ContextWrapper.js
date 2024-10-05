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

function savedEventsReducer(current_state, { action, event }) {
  //console.log("Reducing events:", current_state);
  //console.log(" > action:", action);
  //console.log(" > Event to dispatch:", event);

  switch (action) {
    case 'CREATE': return [...current_state, event];
    case 'MODIFY': {
      const index = current_state.findIndex(e => e._id === event._id);
      if (index !== -1) {
        const updatedEvents = [...current_state];
        updatedEvents[index] = event;
        return updatedEvents;
      }
      else return [...current_state, event];
    }
    case 'DELETE': return current_state.filter(e => e._id !== event._id);
    case 'RESET': return event; 
    default: return current_state;
  }
}

export default function ContextWrapper({ children })
{
  //prima era authReducer, { user: null}, ma perché un oggetto con user dentro? è già assegnaato a user, non capisco
  const [user, dispatchUser] = useReducer(authReducer, null);

  const [ currentDate, setCurrentDate ] = useState(dayjs());
  const [ selectedDay, setSelectedDay ] = useState(dayjs());

  const [ savedEvents, dispatchEvent ] = useReducer(savedEventsReducer, []);
  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const [ showEventModal, setShowEventModal ] = useState(false);
  const [ showEventsList, setShowEventsList ] = useState(false);


  const [ newUser, setNewUser ] = useState(null);
  //TODO poi da togliere, forse
  const [ newFullName, setNewFullName ] = useState("");
  const [ newUsername, setNewUsername ] = useState("");
  const [ newPicture, setNewPicture ] = useState("" );
  const [ newBio, setNewBio ] = useState("");

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

        savedEvents,
        dispatchEvent,
        showEventModal,
        setShowEventModal,
        showEventsList,
        setShowEventsList,
        selectedEvent,
        setSelectedEvent,
      }}>
        {children}
      </GlobalContext.Provider>
    </AuthContext.Provider>
    </>
  );
}
