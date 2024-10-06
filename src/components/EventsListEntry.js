// TODO
// - modify

import GlobalContext from "../context/GlobalContext.js"
import { useState, useContext } from "react"
import { deleteEvent } from "../API/events.js"
import { useAuthContext } from "../hooks/useAuthContext.js"
import dayjs from "dayjs"

export default function EventsListEntry({ event })
{
  var { allEvents, dispatchEvent, setSelectedEvent, setShowEventModal } = useContext(GlobalContext)
  var { user } = useAuthContext();

  const labelsColour = {
    white: "border-white",
    red: "border-red-600",
    orange: "border-orange-500",
    yellow: "border-yellow-400",
    green: "border-green-500",
    cyan: "border-cyan-400",
    blue: "border-blue-600"
  }

  const time_span = () => {
    if ((event.end - event.begin) <= 0) return dayjs(event.begin).format("HH:mm") 
    else return `${dayjs(event.begin).format("HH:mm")} / ${dayjs(event.end).format("HH:mm")}`
  }

  const duration = () => {
    //console.log(event.duration)
    if (event.duration <= 0) return ""

    //TODO vabbè qua ci sono altre mille cose da fare, ad esempio se l'ora è una sola bla bla bla
    const hours = Math.floor(event.duration);
    const minutes = (event.duration - hours) * 60;

    const span_delimiter = (minutes > 0 || hours > 0) ? " - " : ""

    const hours_str = (() => {
      if (hours === 1) return "1 ora "
      else if (hours > 1) return hours+" ore "
      else return ""
    })()
    const hours_minutes_delimiter = hours > 0 && minutes > 0 ? " e " : ""

    const minutes_str = minutes > 0 ? minutes+" minuti" : ""

    return span_delimiter + hours_str + hours_minutes_delimiter + minutes_str;
  }

  const [showMore, setShowMore] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEdit = () => {
    setSelectedEvent(event)
    setShowEventModal(true)
  }

  async function handleDelete() {
    dispatchEvent({ type: "DELETE", payload: event });
    setConfirmDelete(false);
    setShowEventModal(false);
    setSelectedEvent(null);
    try {
      await deleteEvent(event, user);
    } catch (error) {
      console.error('Error deleting event:', error);
      // Handle error appropriately (e.g., show error message to the user)
    }
  }


  return (
  <>
  <div className={`snap-center border-s-4 ${labelsColour[event.label]} mb-6 mr-4 flex flex-col max-w-full`}>
    <div className="pl-2 mr-2 mb-2">
      <h2 className="text-center text-white text-xl font-semibold border-b">{event.title}</h2>
      <div className="flex justify-between border-b mt-1">
        <div className="text-left">
          { event.allDay ?
            <h1 className="text-xl font-bold">Tutto il giorno</h1>
            :
            <h1 className="text-xl font-bold">{time_span()}{duration()}</h1>
          }
        </div>
        <div className="space-x-4 text-xs">
          <span className="hover:cursor-pointer material-symbols-outlined" onClick={handleEdit} title="modifica">create</span>
          { !confirmDelete ?
            <span className="hover:cursor-pointer material-symbols-outlined" onClick={() => setConfirmDelete(true)} title="elimina">delete</span>
            :
            <>
            <span className="hover:cursor-pointer material-symbols-outlined" onClick={() => setConfirmDelete(false)} title="annulla">cancel</span>
            <span className="hover:cursor-pointer material-symbols-outlined" onClick={handleDelete} title="conferma">check</span>
            </>
          }
        </div>
      </div>
      <p className="text-white text-base mt-4">{event.description}</p>
      { showMore ?
        <div>
          <div onClick={() => setShowMore(false)} className="hover:cursor-pointer material-symbols-outlined">arrow_drop_down</div>
          <ul>
            {/* TODO devo ancora fare che quando si modifica cambia la data*/}
            <li>Creato il {dayjs(event.createdAt).format("DD MMMM YYYY")} alle {dayjs(event.createdAt).format("hh:mm")}</li>
            <li>Modificato il {dayjs(event.updatedAt).format("DD MMMM YYYY")} alle {dayjs(event.updatedAt).format("hh:mm")}</li>
            {/* TODO qui sarebbe carino mettere le informazioni di ripetizione */}
            <li className="">Ripetuto: {!event.repeated ? "No" : "Sì"}</li>
          </ul>
        </div>
        :
        <div onClick={() => setShowMore(true)} className="hover:cursor-pointer material-symbols-outlined">arrow_right</div>
      }
    </div>
  </div>
  </>
  )
}
