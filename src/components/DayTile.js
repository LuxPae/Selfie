import GlobalContext from "../context/GlobalContext.js"
import { useContext, useEffect } from "react"
import DayTileEvent from "../components/DayTileEvent.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"

export default function DayTile({ day_date, index, height, last_day_of_month, events })
{

  var { selectedDay, setSelectedDay, currentDate, setSelectedEvent, setShowEventsList, setShowEventModal} = useContext(GlobalContext);

  const year = currentDate.year();
  const month = currentDate.month();

  const isInCurrentMonth = (day_date) => day_date.month() === month;
  const isDaySelected = (day_date) => {
    return day_date.date() === selectedDay.date() && day_date.month() === selectedDay.month() && day_date.year() === selectedDay.year();
  }

  const MonthFormattedStringMMM = (date) => {
    let month = date.format("MMM");
    return month[0].toUpperCase() + month.slice(1);
  }
  const getPrevMonthDate = (current_month) => {
    //return dayjs(new Date(year, month-1, 1));
    return day_date.subtract(0, "month");
  }
  const getNextMonthDate = (current_month) => {
    //return dayjs(new Date(year, month+1, 1));
    return day_date.add(0, "month");
  }

  const css = () => {
    return (
    isInCurrentMonth(day_date) ?
    (
      (isDaySelected(day_date)) ? 
      `text-white ${colors.MAIN_BORDER_LIGHT} border-2 ${colors.CALENDAR_BG_DARK} ${colors.CALENDAR_ACTIVE_BG_DARK}`
      :
      `${colors.MAIN_BG_LIGHT} text-black ${colors.CALENDAR_HOVER_BG_DARK} ${colors.CALENDAR_FOCUS_BG_DARK}`
    )
    :
    (
      (isDaySelected(day_date)) ? 
      "text-white border-white border-2 bg-stone-600 active:bg-stone-600" 
      :
      "bg-stone-400 hover:bg-stone-500 focus:bg-stone-500 text-stone-700"
    ))
  }

  const handleClick = (clicked_event) => {
    setShowEventsList(true);
    //setShowEventModal(true);
    //setSelectedEvent(clicked_event);
  }

  return (
    <>
    <div style={{ height }} onClick={() => setSelectedDay(day_date)} tabIndex="0"
        className={`border-2 border-white ${css()} h-16 flex flex-col justify-start px-1 rounded-lg focus:border-2 hover:border-2 focus:text-white hover:text-white`}
    >
      <div className="flex justify-between">
          {day_date.date()}
          {index === 0 && <span className="text-sm justify-end">{MonthFormattedStringMMM(getPrevMonthDate(month))}&nbsp;</span> }
          {index === last_day_of_month && <span className="text-sm">{MonthFormattedStringMMM(getNextMonthDate(month))}&nbsp;</span> }
      </div>
      <ul style={{scrollbarWidth: "none"}} className="place-self-start ml-1 overflow-auto">
        {/* TODO metterne 2 e se ce ne sono di più scrivere "di più" (o qualcosa del genere) che se schiacciato li mostra tutti con scrollbar piccola (o senza)*/}
        {events.map((e, i) => <li key={i} onClick={() => handleClick(e)}><DayTileEvent event={e}/></li>)}
      </ul>
    </div>
    </>
  )
}
