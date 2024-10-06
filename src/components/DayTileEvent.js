import { useCallback, useContext } from "react"
import GlobalContext from "../context/GlobalContext.js"
import dayjs from "dayjs"

const labelsClasses = {
  white: "bg-white",
  red: "bg-red-600",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green:  "bg-green-500",
  cyan: "bg-cyan-400",
  blue: "bg-blue-600"
}

const labelsClassesHover = {
  white: "hover:bg-white",
  red: "hover:bg-red-600",
  orange: "hover:bg-orange-500",
  yellow: "hover:bg-yellow-400",
  green:  "hover:bg-green-500",
  cyan: "hover:bg-cyan-400",
  blue: "hover:bg-blue-600"
}

const MAX_CHARS = 5;

//TODO vorrei, sapendo la largezza del calendario, mostrare più o meno caratteri (passo width nei props, ma come la prendo?)
// quando si schiaccia su un evento si apre il modal per modificarlo
export default function DayTileEvent({ event })
{
  const { selectedDay } = useContext(GlobalContext);
  const selected_date = selectedDay.startOf("day")
  const event_date = dayjs(event.date).startOf("day")

  const trimmed_title = () => event.title.length <= MAX_CHARS ? event.title : event.title.slice(0, MAX_CHARS)+"...";
  const hover = () => `${labelsClassesHover[event.label]} hover:cursor-pointer hover:rounded-full`

  
  return (<div className={`${hover()} flex items-center space-x-1`} title={event.title}>
    <span className={`${labelsClasses[event.label]} h-3 w-3 rounded-full flex items-center justify-center border border-black`}></span>
    <p className="text-xs">{trimmed_title()}</p>
  </div>)
}
