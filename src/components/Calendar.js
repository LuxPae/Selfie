//TODO 
// - import / export as ICS ?

import GlobalContext from "../context/GlobalContext.js"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import EventModal from "../components/EventModal.js"
import EventsList from "../components/EventsList.js"
import Header from "../components/Header.js"
import DayTile from "../components/DayTile.js"
import { getAllEvents } from "../API/events.js"
import { useAuthContext} from "../hooks/useAuthContext.js"
import dayjs from "dayjs"

const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const Calendar = () => {

  var { currentDate, setCurrentDate, selectedDay, setSelectedDay, showEventModal, showEventsList, setShowEventsList, allEvents, dispatchEvent } = React.useContext(GlobalContext);
  var { user } = useAuthContext();
  const navigate = useNavigate();

  const [filteredEvents, setFilteredEvents] = useState([]);
  const handleFilteredEvents = (filteredEvents) => setFilteredEvents(filteredEvents)

  useEffect(() => {
    if(!user) {
      navigate("/");
    } else {
      getAllEvents(user)
        .then(events => dispatchEvent({ type: "ALL", payload: events }))
        .catch(error => console.error(error.message))
    }
  }, [user])

  const year = currentDate.year();
  const month = currentDate.month();

  const firstDayOfMonth = new Date(year, month, 0).getDay();
  const daysInCurrentMonth = new Date(year, month+1, 0).getDate();

  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.push(dayjs(`${year}-${month}-${daysInPrevMonth - i}`))
  }
  prevMonthDays.reverse();

  const total_tiles_number = () => {
    let sum = prevMonthDays.length + daysInCurrentMonth
    if (sum <= 28) return 28;
    else if (sum <= 35) return 35
    else return 42;
  }

  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => dayjs(new Date(year, month, i+1)));
  const trailingDays = total_tiles_number() - daysInCurrentMonth - firstDayOfMonth;

  const nextMonthDays = Array.from({length: trailingDays >= 0 ? trailingDays : 7+trailingDays}, (_, i) => dayjs(new Date(year, month+1, i+1)));

  const days = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const goPrevMonth = () => {
    setCurrentDate(dayjs(new Date(year, month-1, 1)));
  };
  const goNextMonth = () => {
    setCurrentDate(dayjs(new Date(year, month+1, 1)));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
    setSelectedDay(dayjs());
  }

  const MonthFormattedStringMMMM = (date) => {
    let month = date.format("MMMM");
    return month[0].toUpperCase() + month.slice(1);
  }
  
  useEffect(() => {
    setShowEventsList(true);
  }, [selectedDay]);

  const day_tile_height = () => {
    if (days.length <= 28) return "120px"
    else if (days.length > 35) return "80px"
    else return "96px"
  }

  //TODO sì ma non ci sarà un bottone e sarà in un useEffect con .then()... blablabla
  const prendiliTutti = async () => {
    try {
      let events = await getAllEvents(user);
      console.log(events);

    } catch (error) {
      console.error(error.message);
    }
  }

  const EventModalCSS = () => {
    let css = "m-1"
    if (showEventModal) {
      css = "mx-2 rounded-lg"
    }
    return css
  }

  const EventsListCSS = () => {
    let css = ""
    if (showEventsList) {
      css = ""
    }
    return css
  }

  const CalendarCSS = () => {
    let css = "max-h-auto sm:max-w-full lg:max-w-5xl p-4 bg-green-950 rounded-lg "

    if (!showEventsList) {
      css += " basis-full "
    }
    else if (showEventsList && !showEventModal) {
      css += " basis-1/2 "
    }
    else if (showEventsList && showEventModal) {
      css += " basis-1/3 "
    }

    if (!showEventModal && !showEventsList) {
      css += " basis-full "
    }

    return css;
  }

  return (
    <>
    <div className="flex flex-col">
    <Header/>
    <button onClick={prendiliTutti} className="fixed top-0 text-lg text-green-400 border-2 border-green-700">Prendili tutti</button>

    <div className="flex justify-center">

      <div className={EventsListCSS()}>
        { showEventsList && <EventsList sendFilteredEvents={handleFilteredEvents}/> }
      </div>

      <div className={EventModalCSS()}>
        {showEventModal && <EventModal/>}
      </div>

    <div className={CalendarCSS()}>
      <div className="flex justify-between items-center mb-5">
        <button onClick={goPrevMonth} className="w-10 text-5xl font-bold">‹</button>
        <h2 className="text-4xl font-bold hover:cursor-pointer" title="Vai a oggi" onClick={goToToday}>
            {MonthFormattedStringMMMM(currentDate)} {year}
        </h2>
        <button onClick={goNextMonth} className="w-10 text-5xl font-bold">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-lg text-center">
        {daysOfWeek.map((day, index) => <div key={index} className="font-semibold">{day}</div> )}
        {days.map((day_date, index) => <DayTile key={index} day_date={day_date} events={filteredEvents.filter(e => dayjs(e.date).startOf("day").isSame(day_date.startOf("day")))} index={index} last_day_of_month={days.length-trailingDays} height={day_tile_height()}/>)}
      </div>
    </div>
  </div>
  </div>
  </>
  );
};

export default Calendar;
