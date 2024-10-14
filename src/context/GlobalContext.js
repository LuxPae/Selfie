import React from "react";

const GlobalContext = React.createContext({
  user: null,
  dispatchUser: ({ type, payload }) => {},
  newUser: null,
  setNewUser: (new_user) => {},

  //TODO poi da togliere, forse
  newFullName: "",
  setNewFullName: (new_fullName) => {},
  newUsername: "",
  setNewUsername: (new_username) => {}, 
  newPicture: "", 
  setNewPicture: (new_picture) => {},
  newBio: "", 
  setNewBio: (new_bio) => {}, 
  
  currentDate: null,
  setCurrentDate: (currentDate) => {},
  selectedDay: null, 
  setSelectedDay: (selectedDay) => {},

  allEvents: [],
  dispatchEvent: ({ type, payload }) => {}, 
  selectedEvent: null,
  setSelectedEvent: (new_event) => {}, 
  showEventModal: false,
  setShowEventModal: (new_state) => {},
  showEventsList: false,
  setShowEventsList: (new_state) => {},

  notification: null,
  setNotification: (new_notification) => {},
  showNotification: false,
  setShowNotification: (new_state) => {},
  notify: (type, message) => {},

});

export default GlobalContext;
