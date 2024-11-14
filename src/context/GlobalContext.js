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
  calendarDate: null,
  setCalendarDate: (calendarDate) => {},
  selectedDay: null, 
  setSelectedDay: (selectedDay) => {},

  allEvents: [],
  allEvents_initialize: () => {},
  allEvents_createEvents: (events) => {},
  allEvents_modifyEvents: (events) => {},
  allEvents_deleteEvents: (events) => {},
  multipleDaysEvents: [],

  selectedEvent: null,
  setSelectedEvent: (new_event) => {}, 
  showEventModal: false,
  setShowEventModal: (new_state) => {},
  showEventsList: false,
  setShowEventsList: (new_state) => {},

  currentNotification: null,
  setCurrentNotification: (new_notification) => {},
  showNotification: false,
  setShowNotification: (new_state) => {},
  pendingNotifications: [],
  setPendingNotifications: (new_arr) => {},
  notify: (type, message) => {},

  modifyRepeated: false,
  setModifyRepeated: (new_state) => {},

  filters: null,
  setFilters: (new_filters) => {},

  shownCalendarType: "",
  setShownCalendarType: (new_state) => {},

  showCompletedTasks: false,
  setShowCompletedTasks: (new_state) => {},
});

export default GlobalContext;
