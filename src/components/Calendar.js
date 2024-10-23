// [TODO]
// - import / export as ICS ?
// - quando si schiaccia sul mese si può scegliere (con i bottoni come nel modal) giorno, mese, anno oppure "oggi"

import GlobalContext from "../context/GlobalContext.js"
import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom"
import EventModal from "../components/EventModal.js"
import EventsList from "../components/EventsList.js"
import Header from "../components/Header.js"
import DayTile from "../components/DayTile.js"
import { getAllEvents } from "../API/events.js"
import useCheckForUser from "../hooks/useCheckForUser.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"

const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const Calendar = () => {

  useCheckForUser();

  var { user, currentDate, setCurrentDate, selectedDay, setSelectedDay, showEventModal, showEventsList, setShowEventsList, allEvents, dispatchEvent, filters, shownCalendarType, showCompletedTasks } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [selectingDay, setSelectingDay] = useState(false);

  useEffect(() => {
    if(!user) navigate("/");
  }, [user])

  const filterEventsByDate = (events, date) => events.filter(e => dayjs(date.startOf("day")).isSame(dayjs(e.begin).startOf("day")))
  const filterEventsByLabel = (events) => events.filter((event, i) => filters[event.label]);
  const sortEvents = (events) => events.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
  const filterEventsByType = (events) => shownCalendarType === "tutti" ? events : events.filter((event) => {
    if (shownCalendarType === "eventi") return !event.isTask
    if (shownCalendarType === "attività") return event.isTask
  })
  const filterCompletedTasks = (events) => showCompletedTasks ? events : events.filter((event) => !event.isTask || !event?.isTask.completed)

  const allFilteredEvents = useMemo(() => filterEventsByLabel(allEvents), [allEvents, filters])
  const allSortedEvents = useMemo(() => sortEvents(allFilteredEvents), [allFilteredEvents])
  const allEventsByType = useMemo(() => filterEventsByType(allSortedEvents), [allSortedEvents, shownCalendarType])
  const allEventsToDisplay = useMemo(() => filterCompletedTasks(allEventsByType), [allEventsByType, showCompletedTasks])

  // in realtà non ha senso fare tutto questo, basta farlo per tutti gli eventi e poi filtrare solo per il selectedDay
  //const selectedDayEvents = useMemo(() => filterEventsByDate(selectedDay), [allEvents, selectedDay]);
  //const selectedDayFilteredEvents = useMemo(() => filterEventsByLabel(selectedDayEvents), [selectedDayEvents, filters])
  //const selectedDaySortedEvents = useMemo(() => sortEvents(selectedDayFilteredEvents), [selectedDayFilteredEvents])
  //const selectedDayEventsByType = useMemo(() => filterEventsByType(selectedDaySortedEvents), [selectedDaySortedEvents])
  //const selectedDayEventsToDisplay = useMemo(() => filterEventsByType(selectedDayEventsByType), [selectedDayEventsByType])
  const selectedDayEventsToDisplay = useMemo(() => filterEventsByDate(allEventsToDisplay, selectedDay))

  useEffect(() => {
    getAllEvents(user)
      .then(events => dispatchEvent({ type: "ALL", payload: events }))
      .catch(error => console.error(error.message))
  }, [])

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
    if (selectedDay) setShowEventsList(true);
  }, [selectedDay]);

  const day_tile_height = () => {
    if (days.length <= 28) return "120px"
    else if (days.length > 35) return "80px"
    else return "96px"
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
    let css = `border ${colors.MAIN_BORDER_DARK} max-h-auto sm:max-w-full lg:max-w-5xl p-4 ${colors.CALENDAR_BG_DARK} rounded-lg `

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

    <div className="flex justify-center">

      <div className={EventsListCSS()}>
        { showEventsList && <EventsList events={selectedDayEventsToDisplay}/> }
      </div>

      <div className={EventModalCSS()}>
        {showEventModal && <EventModal/>}
      </div>

    <div className={CalendarCSS()}>
      <div className="flex justify-between items-center mb-5">
        <button onClick={goPrevMonth} className="w-10 text-5xl font-bold">‹</button>
        <div>
          { selectingDay ? <>
              <p>TODO</p>
              <button onClick={goToToday}>Oggi</button>
              <br/>
              <button onClick={() => setSelectingDay(false)}>close</button>
            </>
            :
            <h2 className="text-4xl font-bold cursor-pointer" title="Vai a oggi" onClick={() => setSelectingDay(true)}>
                {MonthFormattedStringMMMM(currentDate)} {year}
            </h2>
          }
        </div>
        <button onClick={goNextMonth} className="w-10 text-5xl font-bold">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-lg text-center">
        {daysOfWeek.map((day, index) => <div key={index} className="font-semibold">{day}</div> )}
        {days.map((day_date, index) => <DayTile key={index} day_date={day_date} events={allEventsToDisplay.filter(e => dayjs(e.begin).startOf("day").isSame(day_date.startOf("day")))} index={index} last_day_of_month={days.length-trailingDays} height={day_tile_height()}/>)}
      </div>
    </div>
  </div>
  </div>
  </>
  );
};

export default Calendar;
