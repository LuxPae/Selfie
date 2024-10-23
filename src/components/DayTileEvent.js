import { useCallback, useContext } from "react"
import GlobalContext from "../context/GlobalContext.js"
import { modifyEvent } from "../API/events.js"
import dayjs from "dayjs"
import { labelsBorder, labelsBackground } from "../scripts/COLORS.js"

const MAX_CHARS = 5;

//TODO vorrei, sapendo la largezza del calendario, mostrare più o meno caratteri (passo width nei props, ma come la prendo?)
// quando si schiaccia su un evento si apre il modal per modificarlo
export default function DayTileEvent({ event })
{
  const { user, selectedDay, notify, dispatchEvent } = useContext(GlobalContext);
  const selected_date = selectedDay.startOf("day")
  const event_date = dayjs(event.date).startOf("day")

  const trimmed_title = () => event.title.length <= MAX_CHARS ? event.title : event.title.slice(0, MAX_CHARS)+"...";

  const handleCompleteTask = async () => {
    if (!event.isTask) return
    const value = !event.isTask.completed
    try {
      const modified_task = {
        ...event,
        isTask: { completed: value }
      }
      const res = await modifyEvent(modified_task, user);
      console.log(res)
      if (!res) throw new Error("Non è stato possibile modificare l'attività")
      dispatchEvent({ type: "MODIFY", payload: modified_task})
      if (value) notify("Calendario", "Attvitià completata")
    } catch(error) {
      console.error("Non è stato possibile modificare l'attività")
      notify("error", error.message)
    }
  }

  const completed = event.isTask?.completed
  
  return (<div className="flex items-center space-x-1" title={event.title}>
    <span className={`${labelsBackground[event.label]} ${completed ? labelsBackground[event.label]+" opacity-50" : ""} rounded w-3 ${event.isTask ? "h-3 cursor-pointer" : "h-1" } flex items-center justify-center text-black`} onClick={handleCompleteTask}>{completed ? '✓' : ""}</span>
    {/*<p className="text-xs">{trimmed_title()}</p>*/}
    <p className={`text-xs ${completed ? "line-through text-zinc-600" : ""}`}>{event.title}</p>
  </div>)
}
