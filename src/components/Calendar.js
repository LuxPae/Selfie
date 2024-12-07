import GlobalContext from "../context/GlobalContext.js"
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"
import EventModal from "../components/EventModal.js"
import EventsList from "../components/EventsList.js"
import Header from "../components/Header.js"
import DayTile from "../components/DayTile.js"
import Button from "../components/Button.js"
import Filters from "../components/Filters.js"
import ShowCalendarTypeComponent from "../components/ShowCalendarTypeComponent.js"
import useCheckForUser from "../hooks/useCheckForUser.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"
import { daysOfWeek, monthsNames } from "../scripts/CONSTANTS.js"

const Calendar = () => {

  useCheckForUser();

  var { user, currentDate, calendarDate, setCalendarDate, selectedDay, setSelectedDay, showEventModal, showEventsList, setShowEventsList, allEvents, allEvents_initialize, filters, shownCalendarType, showCompletedTasks } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [selectingNewDate, setSelectingNewDate] = useState(false)
  const [newDate, setNewDate ] = useState({ day:selectedDay.date(), month:selectedDay.month(), year:selectedDay.year()})
  const handleChangeNewDate = (e) => {
    var new_date = {
      ...newDate,
      [e.target.name]: e.target.value
    }
    setNewDate(new_date)
    const date = dayjs({...new_date})
    setSelectedDay(date)
    setCalendarDate(date.startOf("month"))
  }
  const handleConfirmNewDate = () => {
    setSelectingNewDate(false)
    const date = dayjs({...newDate})
    setSelectedDay(date)
    setCalendarDate(date.startOf("month"))
  }

  useEffect(() => {
    if(!user) navigate("/")

    allEvents_initialize()

    const ls_event = JSON.parse(localStorage.getItem("event_from_home"))
    if (ls_event) {
      const event_day = dayjs(ls_event.begin).startOf("day")
      setSelectedDay(event_day)
      setCalendarDate(event_day.startOf("month"))
      localStorage.removeItem("event_from_home")
    }
  }, [user, currentDate, selectedDay])

  const filterEventsByDate = (events, date) => events.filter(e => dayjs(date.startOf("day")).isSame(dayjs(e.begin).startOf("day")))
  const filterEventsByLabel = (events) => events.filter((event, i) => filters[event.label]);
  const sortEvents = (events) => events.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
  const filterEventsByType = (events) => shownCalendarType === "tutti" ? events : events.filter((event) => {
    if (shownCalendarType === "eventi") return !event.isTask
    else if (shownCalendarType === "attività") return event.isTask
    else return event
  })
  const filterCompletedTasks = (events) => showCompletedTasks ? events : events.filter((event) => !event.isTask || !event?.isTask.completed)

  const allFilteredEvents = filterEventsByLabel(allEvents)
  const allSortedEvents = sortEvents(allFilteredEvents)
  const allEventsByType = filterEventsByType(allSortedEvents)
  const allEventsToDisplay = filterCompletedTasks(allEventsByType)

  const selectedDayEventsToDisplay = filterEventsByDate(allEventsToDisplay, selectedDay)

  const calendarYear = calendarDate.year();
  const calendarMonth = calendarDate.month();

  const firstDayOfCalendarMonth = (calendarDate.day()+6)%7 //perché la settimana parte da lunedì e non da domenica
  const daysInCalendarMonth = calendarDate.daysInMonth()

  const prevCalendarMonth = calendarDate.subtract(1, "month")
  const daysInPrevMonth = prevCalendarMonth.daysInMonth()
  const prevMonthDates = [];
  for (let i = 0; i < firstDayOfCalendarMonth; i++) {
    const day = dayjs(`${calendarYear}-${calendarMonth}-${daysInPrevMonth - i}`)
    prevMonthDates.push(day)
  }
  prevMonthDates.reverse();

  const total_tiles_number = () => {
    let sum = prevMonthDates.length + daysInCalendarMonth
    if (sum <= 28) return 28;
    else if (sum <= 35) return 35
    else return 42;
  }

  const currentMonthDates = Array.from({ length: daysInCalendarMonth }, (_, i) => calendarDate.add(i, "day"));

  const trailingDays = total_tiles_number() - daysInCalendarMonth - firstDayOfCalendarMonth;
  const nextMonthDates = Array.from({length: trailingDays}, (_, i) => calendarDate.add(1, "month").add(i, "day"));

  const calendarMonthDates = [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];

  const goPrevMonth = () => {
    const newCalendarDate = calendarDate.subtract(1, "month")
    setCalendarDate(newCalendarDate)
  };
  const goNextMonth = () => {
    const newCalendarDate = calendarDate.add(1, "month")
    setCalendarDate(newCalendarDate)
  };

  const goToToday = () => {
    setSelectedDay(currentDate);
    setCalendarDate(currentDate.startOf("month"))
    setSelectingNewDate(false)
  }

  const MonthFormattedStringMMMM = (date) => {
    let month = date.format("MMMM");
    return month[0].toUpperCase() + month.slice(1);
  }

  const day_tile_height = () => {
    if (calendarMonthDates.length <= 28) return "120px"
    else if (calendarMonthDates.length > 35) return "80px"
    else return "96px"
  }

  // TODO
  const eventsListCss = () => {
    if (!showEventsList) return "w-0 h-0 hidden"
    else if (showEventModal) return "hidden md:block"
    else return "block"
  }

  const EventModalCSS = () => {
    if (!showEventModal) return "w-0 h-0 hidden"
    else return "block"
  }

  const CalendarCSS = () => {
    let css = `border ${colors.MAIN_BORDER_DARK} max-h-auto sm:max-w-full lg:max-w-5xl p-4 ${colors.CALENDAR_BG_DARK} rounded-lg `

    if (showEventsList || showEventModal) css += " hidden md:block"
    if (!showEventsList) {
      css += " md:basis-full "
    }
    else if (showEventsList && !showEventModal) {
      css += " md:basis-1/2 "
    }
    else if (showEventsList && showEventModal) {
      css += " md:basis-1/3 "
    }

    if (!showEventModal && !showEventsList) {
      css += " md:basis-full "
    }

    return css;
  }

  return (
  <>
  <div className="flex flex-col">
  <Header/>

    <div className="md:flex md:justify-around">
      <div className={`${eventsListCss()} z-10`}>
        { showEventsList && <EventsList events={selectedDayEventsToDisplay}/> }
      </div>
      <div className={`${EventModalCSS()} z-20`}>
        {showEventModal && <EventModal/>}
      </div>
      <div className={`${CalendarCSS()} z-0`}>
        <div className="flex flex-col md:flex-none md:mx-3">
          <div>
            <div className="flex justify-between items-center justify-between">
              <button onClick={goPrevMonth} className="text-5xl -translate-y-1 font-bold">‹</button>
              <div>
                { selectingNewDate ?
                  <div className="flex justify-center">
                    <div className="p-1 flex space-x-2 mr-4">
                      <select className={`appearance-none text-center px-2 rounded ${colors.BUTTON_BG}`} name="day" onChange={handleChangeNewDate} defaultValue={selectedDay.date()}>
                        { Array.from({ length: dayjs({...newDate}).daysInMonth() }, (_, i) => i+1).map(day => <option className="" key={day} value={day}>{day}</option>) }
                      </select>
                      <select className={`appearance-none text-center px-2 rounded ${colors.BUTTON_BG}`} name="month" onChange={handleChangeNewDate} defaultValue={selectedDay.month()}>
                        { monthsNames.map((month, i) => <option key={i} value={i}>{month}</option>) }
                      </select>
                      <select className={`appearance-none text-center px-2 rounded ${colors.BUTTON_BG}`} name="year" onChange={handleChangeNewDate} defaultValue={selectedDay.year()}>
                        { Array.from({ length: 50 }, (_, i) => 2000 + i).map(year => <option key={year} value={year}>{year}</option>) }
                      </select>
                    </div>
                    <div className="p-1 md:border-x md:px-8"><Button click={goToToday} label="Oggi"/></div>
                    <button className="ml-3 material-symbols-outlined" onClick={() => setSelectingNewDate(false)}>close</button>
                  </div>
                  :
                  <h2 className="text-4xl text-center font-bold cursor-pointer" title="Vai a oggi" onClick={() => setSelectingNewDate(true)}>
                    {MonthFormattedStringMMMM(calendarDate)} {calendarYear}
                  </h2>
                }
              </div>
              <button onClick={goNextMonth} className="-translate-y-1 text-5xl font-bold">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-lg text-center">
              {daysOfWeek.map((day, index) => <div key={index} className="font-semibold">{day}</div> )}
              {calendarMonthDates.map((date, index) => <DayTile key={index} day_date={date} events={allEventsToDisplay.filter(e => dayjs(e.begin).startOf("day").isSame(date.startOf("day")))} index={index} last_day_of_month={calendarMonthDates.length-trailingDays} height={day_tile_height()}/>)}
            </div>
          </div>
          <div className="flex mt-3 flex-col md:flex-row justify-between">
            <div><ShowCalendarTypeComponent/></div>
            <div><Filters/></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

export default Calendar;
