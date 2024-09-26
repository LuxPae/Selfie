// TODO
// - modify
// - delete

import { useState } from "react"
import dayjs from "dayjs"

export default function EventsListEntry({ event })
{
  const labelsColour = {
    red: "border-red-600",
    orange: "border-orange-500",
    yellow: "border-yellow-400",
    green: "border-green-500",
    cyan: "border-cyan-400",
    blue: "border-blue-600"
  }

  const time_span = () => {
    return `${dayjs(event.begin).format("HH:mm")} - ${dayjs(event.end).format("HH:mm")}`
  }

  const duration = () => {
    const hours = Math.floor(event.duration / 60);
    const minutes = (event.duration - hours) * 60;
    return event.duration + " " + hours + " " + minutes
  }

  const [showMore, setShowMore] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEdit = () => {
    alert("Edit event");
  }

  const handleDelete = () => {
    alert("Delete event");
  }

  return (
  <>
  <div className={`snap-center border-s-4 ${event.label ? labelsColour[event.label] : "border-white"} mb-6 mr-4 flex flex-col max-w-lg`}>
    <div className="pl-2 mr-2 mb-2">
      { event.all_day ?
        <h1 className="text-xl font-bold">Tutto il giorno</h1>
        :
        <h1 className="text-xl font-bold">{time_span()} ({duration()})</h1>
      }
      <div className="flex justify-between border-b">
        <h2 className="text-white text-xl font-semibold">{event.title}</h2>
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
      <p className="text-white text-base">{event.description}</p>
      { showMore ?
        <div>
          <div onClick={() => setShowMore(false)} className="hover:cursor-pointer material-symbols-outlined">arrow_drop_down</div>
          <p className="mt-4">Creato il {dayjs(event.createdAt).format("DD MMMM YYYY")}</p>
        </div>
        :
        <div onClick={() => setShowMore(true)} className="hover:cursor-pointer material-symbols-outlined">arrow_right</div>
      }
    </div>
  </div>
  </>
  )
}
