//TODO 
// - import / export as ICS ?

import GlobalContext from "../context/GlobalContext.js"
import React, { useEffect } from "react";
import EventModal from "../components/EventModal.js"
import EventsList from "../components/EventsList.js"
import Header from "../components/Header.js"
import { getAllEvents } from "../API/events.js"
import dayjs from "dayjs"

const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const Calendar = () => {

  var { currentDate, setCurrentDate, selectedDay, setSelectedDay, showEventModal, showEventsList, setShowEventsList, savedEvents } = React.useContext(GlobalContext);

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

  const getPrevMonthDate = (current_month) => {
    return dayjs(new Date(year, month-1, 1));
  }
  const getNextMonthDate = (current_month) => {
    return dayjs(new Date(year, month+1, 1));
  }

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
  const MonthFormattedStringMMM = (date) => {
    let month = date.format("MMM");
    return month[0].toUpperCase() + month.slice(1);
  }
  
  const isInCurrentMonth = (day_date) => day_date.month() === month;
  const isDaySelected = (day_date) => {
    return day_date.date() === selectedDay.date() && day_date.month() === selectedDay.month() && day_date.year() === selectedDay.year();
  }

  useEffect(() => {
    setShowEventsList(true);
  }, [selectedDay, setShowEventsList]);

  const day_tile_height = () => {
    if (days.length <= 28) return "120px"
    else if (days.length > 35) return "80px"
    else return "96px"
  }

  const prendiliTutti = async () => {
    let events = await getAllEvents();
    console.log(events);
  }

  const EventModalCSS = () => {
    let css = ""
    if (showEventModal) {
      css = ""
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
    <Header/>

    <button onClick={prendiliTutti} className="fixed top-0 text-lg text-green-400 border-2 border-green-700">Prendili tutti</button>
    <div className="flex mt-2" id="buttons">
      <button onClick={goToToday} className="text-4xl text-green-400 border-2 border-green-700">Oggi</button>
    </div>

    <div className="mt-5 flex flex-row justify-center">

      <div className={EventsListCSS()}>
        { showEventsList && <EventsList/> }
      </div>

      <div className={EventModalCSS()}>
        {showEventModal && <EventModal/>}
      </div>


    <div className={CalendarCSS()}>
      <div className="flex justify-between items-center mb-5">
          <button onClick={goPrevMonth} className="w-10 text-5xl font-bold">‹</button>
          <h2 className="text-4xl font-bold">
              {MonthFormattedStringMMMM(currentDate)} {year}
          </h2>
          <button onClick={goNextMonth} className="w-10 text-5xl font-bold">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-lg text-center">
        {daysOfWeek.map((day, index) => (
            <div key={index} className="font-semibold">
                {day}
            </div>
        ))}
        {days.map((day_date, index) => (
            <div
                key={index}
                tabIndex="0"
                style={{height: day_tile_height()}}
                className={
                  `h-16 flex items-left justify-left pl-2 pt-1 rounded-lg focus:border-white hover:border-white focus:border-4 hover:border-4 focus:text-white hover:text-white
                   ${
                      isInCurrentMonth(day_date) ?
                      (
                        (isDaySelected(day_date)) ? 
                        "text-white border-white border-4 bg-green-900 active:bg-green-900"
                        :
                        "bg-green-100 text-black hover:bg-green-700 focus:bg-green-700"
                      )
                      :
                      (
                        (isDaySelected(day_date)) ? 
                        "text-white border-white border-4 bg-stone-600 active:bg-stone-600" 
                        :
                        "bg-stone-400 hover:bg-stone-500 focus:bg-stone-500 text-stone-700"
                      )
                    }`
                  }
                onClick={() => setSelectedDay(day_date)}
                onKeyUp={(event) => {
                    if (event.key === "Enter") setSelectedDay(day_date);
                  }
                }
            >
              {index === 0 && <span>{MonthFormattedStringMMM(getPrevMonthDate(month))}&nbsp;</span> }
              {index === days.length-trailingDays && <span>{MonthFormattedStringMMM(getNextMonthDate(month))}&nbsp;</span> }
              {day_date.date()}
            </div>
          ))}
        </div>
      </div>
      </div>
      </>
  );
};

export default Calendar;
