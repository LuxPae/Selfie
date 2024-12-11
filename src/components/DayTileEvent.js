import { useContext } from "react"
import GlobalContext from "../context/GlobalContext.js"
import { modifyEvent } from "../API/events.js"
import { labelsBackground } from "../scripts/COLORS.js"

const MAX_CHARS = 5;

export default function DayTileEvent({ event })
{
  const { user, notify, allEvents_modifyEvents } = useContext(GlobalContext);

  // Ho deciso di toglierlo
  const handleCompleteTask = async () => {
    if (!event.isTask) return
    const value = !event.isTask.completed
    try {
      const modified_task = {
        ...event,
        isTask: { completed: value }
      }
      const res = await modifyEvent(modified_task, user);
      if (!res) throw new Error("Non è stato possibile modificare l'attività")
      allEvents_modifyEvents([modified_task])
      if (value) notify([{type:"Calendario", message:"Attvitià completata"}])
    } catch(error) {
      console.error("Non è stato possibile modificare l'attività")
      notify([{type:"error", message:error.message}])
    }
  }

  const lastsMoreDaysFormat = () => {
    const info = event.lastsMoreDays
    if (info) return `(${info.num}/${info.total})`
  }

  const completed = event.isTask?.completed
  
  return (
    <div className={`px-px flex ${event.isTask ? "items-center" : "items-baseline"} space-x-1`}>
      <span className={`${labelsBackground[event.label]} ${completed ? labelsBackground[event.label]+" opacity-50" : ""} rounded min-w-3 ${event.isTask ? "h-3 cursor-pointer" : "h-1 -translate-y-[2px]" } flex items-center justify-center text-black`}>{completed && '✓'}</span>
      <p style={{scrollbarWidth: "none"}} className={`text-xs ${completed && "line-through text-zinc-600"} text-left overflow-x-auto -translate-x-px w-8 md:w-20`}>{lastsMoreDaysFormat()} {event.title}</p>
    </div>
  )
}

/*
<p className={`text-xs leading-none ${completed ? "line-through text-zinc-600" : ""}`}><span className="flex flex-col text-[8px]">{lastsMoreDaysFormat()}</span> {event.title}</p>
*/
