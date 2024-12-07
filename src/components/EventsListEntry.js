import GlobalContext from "../context/GlobalContext.js"
import { useState, useContext, useEffect } from "react"
import { getEventsByRepId, deleteEvents, modifyEvent } from "../API/events.js"
import { labelsAccent, labelsBackground, labelsTextContrast, labelsBorderContrast } from "../scripts/COLORS.js"
import dayjs from "dayjs"

function EventActionButton({ icon, label, action, otherCss })
{
  return (
    <div className="p-px w-fit flex flex-col items-center cursor-pointer text-center rounded-lg hover:scale-110 hover:linear duration-500" onClick={() => action()}>
      <span className={`text-base material-symbols-outlined -mb-[5px] ${otherCss}`}>{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  )
}

export default function EventsListEntry({ event })
{
  var { user, notify, selectedDay, allEvents_modifyEvents, allEvents_deleteEvents, selectedEvent, setSelectedEvent, setIsCreatingNewEvent, setShowEventModal, setModifyRepeated, setDuplicatedEvent } = useContext(GlobalContext)

  const [trucateDescription, setTruncateDescription] = useState(true)
  const truncateLongText = (text, max_chars) => {
    if (text.length <= max_chars) return <span>{text}</span> 
    else return (<span>{text.slice(0, max_chars)}<span className="cursor-pointer animate-pulse" onClick={() => setTruncateDescription(false)}>...</span></span>)
  }
  const MAX_CHARS_DESC = 170

  useEffect(() => {
    setShowMore(false)
  }, [selectedDay])

  const time_span = () => {
    if (dayjs(event.begin).isSame(dayjs(event.end))) return dayjs(event.begin).format("HH:mm") 
    else return `${dayjs(event.begin).format("HH:mm")} ~ ${dayjs(event.end).format("HH:mm")}`
  }

  const [deletingEvents, setDeletingEvents] = useState(null)

  //TODO
  const duration = () => {
    const begin = dayjs(event.begin)
    const end = dayjs(event.end)
    const d_ms = end.diff(begin)
    const d_min = d_ms/(1000*60)
    const d_h = d_ms/(1000*60*60)

    //TODO vabbè qua ci sono altre mille cose da fare, ad esempio?
    const hours = Math.floor(d_h);
    const minutes = d_min - hours*60

    const hours_str = (() => {
      if (hours === 1) return "1 ora "
      else if (hours > 1) return hours+" ore "
      else return ""
    })()
    const hours_minutes_delimiter = hours > 0 && minutes > 0 ? " e " : ""

    const minutes_str = minutes > 0 ? minutes+" minuti" : ""

    return hours_str + hours_minutes_delimiter + minutes_str;
  }

  const [showMore, setShowMore] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRepeatedModify, setConfirmRepeatedModify] = useState(false);

  const handleEdit = (modifyRepeated) => {
    setIsCreatingNewEvent(true)
    setConfirmRepeatedModify(false)
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
      if (deleteAllRepeatedEvents) notify([{type:"Calendario", message:`${events.length} ${types} eliminat${event.isTask ? "e" : "i"}`}])
      else notify([{type:"Calendario", message:`${type} eliminat${event.isTask ? "a" : "o"}`}])
      if (event === selectedEvent) {
        // in base a come voglio che funzioni
        //setShowEventModal(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      notify([{type:"error", message:error.message}])
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
      if (!e.target.checked) notify([{type:"Calendario", message:"Attvitià completata"}])
    } catch(error) {
      console.error("Non è stato possibile modificare l'attività")
      notify([{type:"error", message:error.message}])
    }
  }

  const clickEdit = () => {
    if (event.repeated) {
      setConfirmRepeatedModify(true)
      setConfirmDelete(false)
    } else handleEdit(false)
  }

  const lastsMoreDaysFormat = () => {
    const info = event.lastsMoreDays
    if (info) return `(${info.num}/${info.total})`
  }

  const completed = event.isTask?.completed;

  const lastsMoreDaysDisplayHour = () => {
    if (event.lastsMoreDays.num === 1) return <h1 className="text-base font-bold">Dalle {dayjs(event.begin).format("HH:mm")}</h1>
    else if (event.lastsMoreDays.num === event.lastsMoreDays.total) return <h1 className="text-base font-bold">Fino alle {dayjs(event.end).format("HH:mm")}</h1>
  }

  const duplicateEvent = () => {
    setDuplicatedEvent(event)
    setShowEventModal(true)
  }

  return (
  <>
  <div className={`snap-center mb-6 flex flex-col max-w-sm rounded ${labelsBackground[event.label]} ${labelsTextContrast[event.label]} ${completed ? "opacity-50 hover:opacity-100" : ""}`}>
    <div className={`overflow-hidden rounded`}>
      <div className={`flex relative items-center ${completed ? "border-0" : "border-b-2"} w-full ${labelsBorderContrast[event.label]}`}>
        { event.isTask && <input type="checkbox" checked={event.isTask.completed} 
                                 className={`rounded cursor-pointer absolute left-1 w-5 h-5 ${labelsAccent[event.label]}`} onChange={handleCompleteTask}/> }
        <h2 style={{scrollbarWidth:"none"}} className={`text-left text-xl font-bold overflow-auto mr-2 ${event.isTask ? "ml-8" : "ml-2"} ${completed ? "line-through ml-8" : labelsTextContrast[event.label]}`}>{event.title} {lastsMoreDaysFormat()}</h2>
      </div>
      { !completed && <div>
        { !event.allDay && <div className={`pl-2 border-b-2 ${labelsBorderContrast[event.label]}`}>
          { !event.lastsMoreDays ?
            <div className="text-base font-semibold">{event.isTask ? dayjs(event.begin).format("HH:mm") : time_span()}</div>
            :
            lastsMoreDaysDisplayHour()
          }
          </div>
        }
        <div className={`border-b-2 ${labelsBorderContrast[event.label]}`}>
          <div className="flex text-xs justify-around items-center select-none">
            { !confirmRepeatedModify ?
              <EventActionButton icon="create" label="modifica" action={clickEdit}/>
              :
              <>
              { event.repeated && 
                <>
                <EventActionButton icon="edit_off" label="annulla" action={() => setConfirmRepeatedModify(false)}/>
                <EventActionButton icon="pages" label={"singol"+(event.isTask ? "a" : "o")} action={() => handleEdit(false)}/>
                <EventActionButton icon="stack_star" label={"ripetut"+(event.isTask ? "e" : "i")} action={() => handleEdit(true)}/>
                </>
              }
              </>
            }
            { !confirmDelete ?
              <EventActionButton icon="delete" label="elimina" action={() => { setConfirmDelete(true); setConfirmRepeatedModify(false) }}/>
              :
              <>
              <EventActionButton icon="delete_forever" label="annulla" action={() => setConfirmDelete(false)}/>
              <EventActionButton icon="check" label={event.repeated ? ("singol"+(event.isTask ? "a" : "o")) : "conferma"} action={() => handleDelete(false)}
                                 otherCss={(deletingEvents && deletingEvents.count === 1) && "animate-spin"}/>
              { event.repeated && <EventActionButton icon="done_all" label={"ripetut"+(event.isTask ? "e" : "i")} action={() => handleDelete(true)}
                                                     otherCss={(deletingEvents && deletingEvents.count > 1) && "animate-spin"}
              />}
              </>
            }
            <EventActionButton icon="content_copy" label="copia" action={duplicateEvent}/>
          </div>
        </div>
        { event.description && <div style={{scrollbarWidth: "thin"}} className="text-base py-2 border-b overflow-auto">
              {trucateDescription ? 
                truncateLongText(event.description, MAX_CHARS_DESC) 
                : 
                <span>{event.description}<span className="material-symbols-outlined text-sm cursor-pointer" onClick={() => setTruncateDescription(true)}>&nbsp;vertical_align_top</span></span>
              }
        </div>}
        <div className="translate-y-1">
          { showMore ?
            <div>
              <div onClick={() => setShowMore(false)} className="cursor-pointer material-symbols-outlined">arrow_drop_down</div>
              <ul className="ml-4 list-['🠒']">
                {/* TODO devo ancora fare che quando si modifica cambia la data: l'ho fatto e non funziona, forse ho risolto, devo controllare*/}
                {!event.allDay && <li>&nbsp;Dura {duration()}</li>}
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
