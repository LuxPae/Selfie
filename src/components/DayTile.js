import GlobalContext from "../context/GlobalContext.js"
import { useContext, useEffect } from "react"
import DayTileEvent from "../components/DayTileEvent.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"

export default function DayTile({ day_date, index, height, last_day_of_month, events })
{
  var { calendarDate, selectedDay, setSelectedDay, setSelectedEvent, setShowEventsList, setShowEventModal} = useContext(GlobalContext);

  const year = selectedDay.year();
  const month = selectedDay.month();

  const isInCalendarMonth = () => calendarDate.month() === day_date.month();
  const isDaySelected = (w) => day_date.startOf("day").isSame(selectedDay.startOf("day"))

  const MonthFormattedStringMMM = (date) => {
    let month = date.format("MMM");
    return month[0].toUpperCase() + month.slice(1);
  }

  const css = () => {
    if (isInCalendarMonth()) {
      if (isDaySelected()) return `text-white ${colors.MAIN_BORDER_LIGHT} border-2 ${colors.CALENDAR_BG_DARK} ${colors.CALENDAR_ACTIVE_BG_DARK}`
      else return `${colors.MAIN_BG_LIGHT} text-black ${colors.CALENDAR_HOVER_BG_DARK} ${colors.CALENDAR_FOCUS_BG_DARK}` 
    }
    else {
      if (isDaySelected()) return "text-white border-white border-2 bg-stone-600 active:bg-stone-600"
      else return "bg-stone-400 hover:bg-stone-500 focus:bg-stone-500 text-stone-700" 
    }
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
          {index === 0 && <span className="text-sm justify-end">{MonthFormattedStringMMM(day_date)}&nbsp;</span> }
          {index === last_day_of_month && <span className="text-sm">{MonthFormattedStringMMM(day_date)}&nbsp;</span> }
      </div>
      <ul style={{scrollbarWidth: "none"}} className="place-self-start ml-1 overflow-auto">
        {/* TODO metterne 2 e se ce ne sono di più scrivere "di più" (o qualcosa del genere) che se schiacciato li mostra tutti con scrollbar piccola (o senza)
                 oppure, meglio sistemo la grandezza e poi metto un overflow-x */}
        {events.map((e, i) => <li key={i} onClick={() => handleClick(e)}><DayTileEvent event={e}/></li>)}
      </ul>
    </div>
    </>
  )
}
