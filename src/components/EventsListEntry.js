// [TODO]
// - eventsList troppo grande in larghezza
import GlobalContext from "../context/GlobalContext.js"
import { useState, useContext, useEffect } from "react"
import { getEventsByRepId, deleteEvents, modifyEvent } from "../API/events.js"
import { labelsText, labelsBorder, labelsAccent, labelsBackground, titleColor } from "../scripts/COLORS.js"
import dayjs from "dayjs"


export default function EventsListEntry({ event })
{
  var { user, notify, selectedDay, allEvents, allEvents_modifyEvents, allEvents_deleteEvents, selectedEvent, setSelectedEvent, setShowEventModal, setModifyRepeated } = useContext(GlobalContext)

  useEffect(() => {
    setShowMore(false)
  }, [selectedDay])

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

  async function handleDelete(deleteAllRepeatedEvents) {
    const type = event.isTask ? "attività" : "evento"
    const types = event.isTask ? "attività" : "eventi"
    const type_art = event.isTask ? "l'attività" : "l'evento"
    const types_art = event.isTask ? "le attività" : "gli eventi"
    var events = [];
    try {
      if (event.repeated && deleteAllRepeatedEvents) {
        events = await getEventsByRepId(user, event.repeatedData.rep_id)
      } else events.push(event)
      setDeletingEvents({ count: events.length });
      const done = await deleteEvents(events, user);
      if (!done) {
        if (deleteAllRepeatedEvents) throw new Error(`Non è stato possibile eliminare ${type_art}, errore nel server`)
        else throw new Error(`Non è stato possibile eliminare ${types_art}, errore nel server`)
      }
      setConfirmDelete(false);
      setDeletingEvents(null);
      allEvents_deleteEvents(events)
      if (deleteAllRepeatedEvents) notify("Calendario", `${events.length} ${types} eliminat${event.isTask ? "e" : "i"}`)
      else notify("Calendario", `${type} eliminat${event.isTask ? "a" : "o"}`)
      if (event === selectedEvent) {
        // TODO dipende da come voglio che funzioni
        //setShowEventModal(false);
        setSelectedEvent(null);
      }
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
      else return `Manca${data.endsAfter === 2 ? "" : "no"} ${data.endsAfter-1} occorrenz${data.endsAfter === 2 ? 'a' : 'e'}`
    }
    else return `Fino a ${dayjs(data.endsOn).format("dddd D MMMM YYYY")}`
  }

  const handleCompleteTask = async (e) => {
    try {
      const modified_task = {
        ...event,
        isTask: { completed: e.target.checked }
      }
      const res = await modifyEvent(modified_task, user);
      if (!res) throw new Error("Non è stato possibile modificare l'attività")
      allEvents_modifyEvents([modified_task])
      if (!e.target.checked) notify("Calendario", "Attvitià completata")
    } catch(error) {
      console.error("Non è stato possibile modificare l'attività")
      notify("error", error.message)
    }
  }

  const completed = event.isTask?.completed;

  return (
  <>
  <div className={`snap-center mb-6 flex flex-col max-w-full ${completed ? labelsText[event.label]+" opacity-50 hover:opacity-100" : "text-white"}`}>
    <div className={`overflow-hidden rounded mr-4 border-2 ${completed ? "border-transparent" : labelsBorder[event.label] }`}>
      <div className={`flex relative items-center ${completed ? "justify-start" : "justify-center "+labelsBackground[event.label]}`}>
        { event.isTask && <>
          <input type="checkbox" checked={event.isTask.completed} className={`rounded cursor-pointer absolute left-1 w-5 h-5 ${labelsAccent[event.label]}`} onChange={handleCompleteTask}/>
        </>}
        <h2 className={`text-center text-xl font-semibold ${completed ? "line-through ml-8" : titleColor[event.label]}`}>{event.title}</h2>
      </div>
      { !(event.isTask && completed) && <div className="m-2">
        <div className={`flex justify-between border-b mt-1`}>
          <div className="text-left flex items-center pb-[4px]">
            { event.allDay ?
              <h1 className="text-xl font-bold">Tutto il giorno</h1>
              :
              <>
              { event.isTask ?
                <h1 className="text-xl font-bold">{dayjs(event.begin).format("HH:mm")}</h1>
                :
                <h1 className="text-xl font-bold">{time_span()}{duration()}</h1>
              }
              </>
            }
          </div>
          <div className="space-x-3 flex text-xs items-center cursor-pointer select-none">
            { !confirmRepeatedModify ?
              <div className="flex flex-col items-center" onClick={() => setConfirmRepeatedModify(true)}>
                <span className="material-symbols-outlined">create</span>
                <span>modifica</span>
              </div>
              :
              <>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => setConfirmRepeatedModify(false)}>
                <span className="material-symbols-outlined">edit_off</span>
                <span>annulla</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleEdit(false)}>
                <span className="material-symbols-outlined">pages</span>
                { event.repeated ? <span>singol{event.isTask ? "a" : "o"}</span> : <span>conferma</span> }
              </div>
              { event.repeated &&
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => handleEdit(true)}>
                    <span className="material-symbols-outlined">stack_star</span>
                    <span>ripetut{event.isTask ? "e" : "i"}</span>
                  </div>
              }
              </>
            }
            { !confirmDelete ?
              <>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => setConfirmDelete(true)}>
                <span className="material-symbols-outlined">delete</span>
                <span>elimina</span>
              </div>
              </>
              :
              <>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => setConfirmDelete(false)}>
                <span className="material-symbols-outlined">delete_forever</span>
                <span>annulla</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer" onClick={() => handleDelete(false)}>
                <span className={`material-symbols-outlined ${(deletingEvents && deletingEvents.count === 1) ? "animate-spin" : ""}`}>check</span>
                { event.repeated ? <span>singol{event.isTask ? "a" : "o"}</span> : <span>conferma</span> }
              </div>
              { event.repeated &&
                  <div className="flex flex-col items-center cursor-pointer" onClick={() => handleDelete(true)}>
                    <span className={`material-symbols-outlined ${(deletingEvents && deletingEvents.count > 1) ? "animate-spin" : ""}`}>done_all</span>
                    <span>ripetut{event.isTask ? "e" : "i"}</span>
                  </div>
              }
              </>
            }
          </div>
        </div>
        { event.description && <p className="text-base py-2 border-b">{event.description}</p>}
        <div className="translate-y-1">
          { showMore ?
            <div>
              <div onClick={() => setShowMore(false)} className="cursor-pointer material-symbols-outlined">arrow_drop_down</div>
              <ul className="ml-4 list-['🠒']">
                {/* TODO devo ancora fare che quando si modifica cambia la data: l'ho fatto e non funziona, forse ho risolto, devo controllare*/}
                <li>&nbsp;Creat{event.isTask ? "a" : "o"} il {dayjs(event.createdAt).format("D MMMM YYYY")} alle {dayjs(event.createdAt).format("HH:mm")}</li>
                { !dayjs(event.createdAt).isSame(dayjs(event.updatedAt)) && <li>&nbsp;Modificat{event.isTask ? "a" : "o"} il {dayjs(event.updatedAt).format("D MMMM YYYY")} alle {dayjs(event.updatedAt).format("HH:mm")}</li> }
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
            <div onClick={() => setShowMore(true)} className="cursor-pointer material-symbols-outlined">arrow_right</div>
          }
        </div>
      </div>}
    </div>
  </div>
  </>
  )
}
