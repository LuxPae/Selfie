import GlobalContext from "../context/GlobalContext.js"
import { useContext } from "react"
import DayTileEvent from "../components/DayTileEvent.js"
import * as colors from "../scripts/COLORS.js"

export default function DayTile({ day_date, index, height, last_day_of_month, events })
{
  var { currentDate, calendarDate, selectedDay, setSelectedDay, setShowEventsList } = useContext(GlobalContext);

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
      if (isDaySelected()) return "text-white border-white border-2 bg-stone-600 md:active:bg-stone-600"
      else return "bg-stone-400 md:hover:bg-stone-500 focus:bg-stone-500 text-stone-700" 
    }
  }

  const handleClick = (clicked_event) => {
    //setShowEventModal(true);
    //setSelectedEvent(clicked_event);
  }

  const isCurrentDayNumber = (day_date.date() === currentDate.date() && day_date.month() === currentDate.month())

  const hasMonthName = index === 0 || index === last_day_of_month

  return (
    <>
    <div style={{ height }} onClick={() => { setSelectedDay(day_date); setShowEventsList(true) }} tabIndex="0"
        className={`border-2 border-white ${css()} h-16 flex flex-col justify-start rounded-lg focus:border-2 md:hover:border-2 focus:text-white md:hover:text-white`}
    >
      <div className={`flex flex-col-reverse md:flex-row md:justify-between ${!isCurrentDayNumber && "md:pl-1"}`}>
          <div className={`${isCurrentDayNumber && "font-black border rounded-md px-1 bg-stone-800 text-white"} ${hasMonthName && "-translate-y-2 md:translate-y-0"}`}>
            {day_date.date()}
            <span className={`${!events.length && "hidden"} text-xs ml-1`}>({events.length || ""})</span>
          </div>
          {index === 0 && <span className="text-sm justify-end">{MonthFormattedStringMMM(day_date)}&nbsp;</span> }
          {index === last_day_of_month && <span className="text-sm">{MonthFormattedStringMMM(day_date)}&nbsp;</span> }
      </div>
      <ul style={{scrollbarWidth: "none"}} className={`place-self-start w-full ml-1 rounded-lg overflow-y-auto ${hasMonthName && "-translate-y-2 md:translate-y-0"}`}>
        {events.map((e, i) => <li key={i} onClick={() => handleClick(e)}><DayTileEvent event={e}/></li>)}
      </ul>
    </div>
    </>
  )
}
