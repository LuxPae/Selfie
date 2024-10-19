//TODO 
// - quando si elimina un evento chiede se eliminare anche tutti quelli ripetuti
import GlobalContext from "../context/GlobalContext.js"
import { useState, useContext, useEffect } from "react"
import { getAllEvents, getEventsByRepId, deleteEvents } from "../API/events.js"
import dayjs from "dayjs"

export default function EventsListEntry({ event })
{
  var { user, notify, allEvents, dispatchEvent, selectedEvent, setSelectedEvent, setShowEventModal, setModifyRepeated } = useContext(GlobalContext)

  useEffect(() => {
    getAllEvents(user)
      .then(events => dispatchEvent({ type: "ALL", payload: events }))
      .catch(error => console.error(error.message))
    console.log("getting all events")
  }, [handleDelete])

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
    if (dayjs(event.begin).isSame(dayjs(event.end))) return dayjs(event.begin).format("HH:mm") 
    else return `${dayjs(event.begin).format("HH:mm")} / ${dayjs(event.end).format("HH:mm")}`
  }

  const [deletingEvents, setDeletingEvents] = useState(null)

  const duration = () => {
    return " TODO: durata"
    if (event.duration <= 0) return ""

    //TODO vabbè qua ci sono altre mille cose da fare, ad esempio?
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
  const [confirmRepeatedModify, setConfirmRepeatedModify] = useState(false);

  const handleEdit = (modifyRepeated) => {
    setConfirmRepeatedModify(false);
    setSelectedEvent(event)
    setModifyRepeated(modifyRepeated)
    setShowEventModal(true)
  }

  //TODO forse il problema sta in una mancaza di refreshing in allEvents o in uno degli altri, forse dovrei mettere tutti con useMemo???
  async function handleDelete(deleteAllRepeatedEvents) {
    var events = [];
    try {
      if (event.repeated && deleteAllRepeatedEvents) {
        events = await getEventsByRepId(user, event.repeatedData.rep_id)
      } else events.push(event)
      setDeletingEvents({ count: events.length });
      const done = await deleteEvents(events, user);
      if (!done) throw new Error("Non è stato possibile eliminare gli/l'eventi/o, errore nel server")
      setConfirmDelete(false);
      setDeletingEvents(null);
      notify("Calendario", "evento eliminato")
      if (event === selectedEvent) {
        // TODO dipende da come voglio che funzioni
        //setShowEventModal(false);
        setSelectedEvent(null);
      }
      for (let e of events) dispatchEvent({ type: "DELETE", payload: e });
    } catch (error) {
      console.error('Error deleting event:', error);
      notify("error", error.message);
    } 
  }

  const formatRepeatedEvery = (every) => {
    switch (every) {
      case "day": return "giorno"
      case "week": return "settimana"
      case "month": return "mese"
      case "year": return "anno"
      default: return "mai"
    }
  }

  const formatRepeatedEnds = (data) => {
    if (data.type === "endsAfter") {
      if (data.endsAfter === 1) return "Finisce con questa occorrenza"
      else return `Manca${data.endsAfter === 2 ? "" : "no"} ${data.endsAfter} occorrenz${data.endsAfter === 2 ? 'a' : 'e'}`
    }
    else return `Fino a ${dayjs(data.endsOn).format("dddd D MMMM YYYY")}`
  }

  return (
  <>
  <div className={`snap-center border-s-4 ${labelsColour[event.label]} mb-6 mr-4 flex flex-col max-w-full`}>
    <div className="pl-2 mr-2">
      <h2 className="text-center text-white text-xl font-semibold border-b">{event.title}</h2>
      <div className="flex justify-between border-b mt-1">
        <div className="text-left flex items-center pb-[4px]">
          { event.allDay ?
            <h1 className="text-xl font-bold">Tutto il giorno</h1>
            :
            <h1 className="text-xl font-bold">{time_span()}{duration()}</h1>
          }
        </div>
        <div className="space-x-3 flex text-xs items-center hover:cursor-pointer">
          { !confirmRepeatedModify ?
            <div className="flex flex-col items-center" onClick={() => setConfirmRepeatedModify(true)}>
              <span className="material-symbols-outlined">create</span>
              <span>modifica</span>
            </div>
            :
            <>
            <div className="flex flex-col items-center hover:cursor-pointer" onClick={() => setConfirmRepeatedModify(false)}>
              <span className="material-symbols-outlined">edit_off</span>
              <span>annulla</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer" onClick={() => handleEdit(false)}>
              <span className="material-symbols-outlined">pages</span>
              { event.repeated ? <span>singolo</span> : <span>conferma</span> }
            </div>
            { event.repeated &&
                <div className="flex flex-col items-center hover:cursor-pointer" onClick={() => handleEdit(true)}>
                  <span className="material-symbols-outlined">stack_star</span>
                  <span>ripetuti</span>
                </div>
            }
            </>
          }
          { !confirmDelete ?
            <>
            <div className="flex flex-col items-center hover:cursor-pointer" onClick={() => setConfirmDelete(true)}>
              <span className="material-symbols-outlined">delete</span>
              <span>elimina</span>
            </div>
            </>
            :
            <>
            <div className="flex flex-col items-center hover:cursor-pointer" onClick={() => setConfirmDelete(false)}>
              <span className="material-symbols-outlined">delete_forever</span>
              <span>annulla</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer" onClick={() => handleDelete(false)}>
              <span className={`material-symbols-outlined ${(deletingEvents && deletingEvents.count === 1) ? "animate-spin" : ""}`}>check</span>
              { event.repeated ? <span>singolo</span> : <span>conferma</span> }
            </div>
            { event.repeated &&
                <div className="flex flex-col items-center hover:cursor-pointer" onClick={() => handleDelete(true)}>
                  <span className={`material-symbols-outlined ${(deletingEvents && deletingEvents.count > 1) ? "animate-spin" : ""}`}>done_all</span>
                  <span>ripetuti</span>
                </div>
            }
            </>
          }
        </div>
      </div>
      { event.description && <p className="text-white text-base py-2 border-b">{event.description}</p>}
      { showMore ?
        <div>
          <div onClick={() => setShowMore(false)} className="hover:cursor-pointer material-symbols-outlined">arrow_drop_down</div>
          <ul className="ml-4 list-['🠒']">
            {/* TODO devo ancora fare che quando si modifica cambia la data: l'ho fatto e non funziona, forse ho risolto, devo controllare*/}
            <li>&nbsp;Creato il {dayjs(event.createdAt).format("D MMMM YYYY")} alle {dayjs(event.createdAt).format("hh:mm")}</li>
            <li>&nbsp;Modificato il {dayjs(event.updatedAt).format("D MMMM YYYY")} alle {dayjs(event.updatedAt).format("hh:mm")}</li>
            {event.repeated ? <>
                <li>&nbsp;Si ripete ogni {formatRepeatedEvery(event.repeatedData.every)}</li>
                <li>&nbsp;{formatRepeatedEnds(event.repeatedData)}</li>
              </>
              :
              <li>&nbsp;Non si ripete</li>
            }            
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
