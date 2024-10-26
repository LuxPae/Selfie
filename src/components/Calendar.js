// [TODO]
// - import / export as ICS ?

import GlobalContext from "../context/GlobalContext.js"
import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom"
import EventModal from "../components/EventModal.js"
import EventsList from "../components/EventsList.js"
import Header from "../components/Header.js"
import DayTile from "../components/DayTile.js"
import Button from "../components/Button.js"
import { getAllEvents } from "../API/events.js"
import useCheckForUser from "../hooks/useCheckForUser.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"
import { daysOfWeek, monthsNames } from "../scripts/CONSTANTS.js"

const Calendar = () => {

  useCheckForUser();

  var { user, currentDate, setCurrentDate, selectedDay, setSelectedDay, showEventModal, showEventsList, setShowEventsList, allEvents, allEvents_initialize, filters, shownCalendarType, showCompletedTasks } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [selectingNewDate, setSelectingNewDate] = useState(false)
  const [selectingNewDay, setSelectingNewDay] = useState(false)
  const [selectingNewMonth, setSelectingNewMonth] = useState(false)
  const [selectingNewYear, setSelectingNewYear] = useState(false)
  const [newDate, setNewDate ] = useState({ day:selectedDay.date(), month:selectedDay.month(), monthName:selectedDay.format("MMMM"), year:selectedDay.year()})
  const handleChangeNewDate = (e) => {
    var new_date = {
      ...newDate,
      [e.target.name]: e.target.value
    }
    if (e.target.name === "month") new_date.monthName = monthsNames[new_date.month]
    setNewDate(new_date)
    const date = dayjs({...new_date})
    setSelectedDay(date)
    setCurrentDate(date)
  }
  const handleConfirmNewDate = () => {
    setSelectingNewDate(false)
    const date = dayjs({...newDate})
    setSelectedDay(date)
    setCurrentDate(date)
  }

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

  const allFilteredEvents = filterEventsByLabel(allEvents)
  const allSortedEvents = sortEvents(allFilteredEvents)
  const allEventsByType = filterEventsByType(allSortedEvents)
  const allEventsToDisplay = filterCompletedTasks(allEventsByType)

  const selectedDayEventsToDisplay = filterEventsByDate(allEventsToDisplay, selectedDay)

  useEffect(() => {
    allEvents_initialize()
  }, [allEvents])

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
    setSelectingNewDate(false)
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
          { selectingNewDate ? <div className="flex">
              <button className="mr-3 material-symbols-outlined" onClick={handleConfirmNewDate}>check</button>
              <div className="border-l p-1 pl-4 flex space-x-2 mr-4">
                { selectingNewDay ? <>
                  <select className={`rounded ${colors.BUTTON_BG}`} name="day" onChange={handleChangeNewDate} defaultValue={selectedDay.date()}>
                    { Array.from({ length: daysInCurrentMonth }, (_, i) => i+1).map(day => <option key={day} value={day}>{day}</option>) }
                  </select>
                  </>
                  :
                  <Button click={() => setSelectingNewDay(true)} label={newDate.day}/> 
                }
                { selectingNewMonth ? <>
                  <select className={`rounded ${colors.BUTTON_BG}`} name="month" onChange={handleChangeNewDate} defaultValue={selectedDay.month()}>
                    { monthsNames.map((month, i) => <option key={i} value={i}>{month}</option>) }
                  </select>
                  </>
                  :
                  <Button click={() => setSelectingNewMonth(true)} label={newDate.monthName}/>
                }
                { selectingNewYear ? <>
                  <select className={`rounded ${colors.BUTTON_BG}`} name="year" onChange={handleChangeNewDate} defaultValue={selectedDay.year()}>
                    { Array.from({ length: 100 }, (_, i) => 2000 + i).map(year => <option key={year} value={year}>{year}</option>) }
                  </select>
                  </>
                  :
                  <Button click={() => setSelectingNewYear(true)} label={newDate.year}/>
                }
              </div>
              <div className="p-1 px-4 border-x"><Button click={goToToday} label="Oggi"/></div>
              <button className="ml-3 material-symbols-outlined" onClick={() => setSelectingNewDate(false)}>close</button>
            </div>
            :
            <h2 className="text-4xl font-bold cursor-pointer" title="Vai a oggi" onClick={() => setSelectingNewDate(true)}>
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
