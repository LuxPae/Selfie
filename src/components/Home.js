import GlobalContext from "../context/GlobalContext.js"
import useCheckForUser from "../hooks/useCheckForUser.js"
import Header from "../components/Header.js"
import * as colors from "../scripts/COLORS.js"
import { MAX_EVENTS_NUM } from "../scripts/CONSTANTS.js"
import { useState, useEffect, useContext } from "react"
import { modifyEvent } from "../API/events.js"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const truncateLongText = (text, max_chars) => text.length <= max_chars ? text : text.slice(0, max_chars)+"..."

const EventEntry = ({event}) => {
  const navigate = useNavigate()

  const { currentDate, setSelectedDay, setCalendarDate, setSelectedEvent, setShowEventsList, user, allEvents_modifyEvents, notify } = useContext(GlobalContext)

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

  const isDateToday = (date) => dayjs(date).startOf("day").isSame(currentDate.startOf("day"))

  const multipleDaysEventBeginDate = (event) => {
    const begin = dayjs(event.begin)
    if (isDateToday(begin)) return "oggi"
    else return begin.format("dddd D MMMM YYYY")
  }
  const multipleDaysEventEndDate = (event) => {
    const end = dayjs(event.end)
    if (isDateToday(end)) return "oggi"
    else return end.format("dddd D MMMM YYYY")
  }
  const multipleDaysEventBeginHour = (event) => {
    if (event.allDay) return "Da "
    else return `Dalle ${dayjs(event.begin).format("HH:mm")} di `
  }
  const multipleDaysEventEndHour = (event) => {
    if (event.allDay) return "A "
    else return `Alle ${dayjs(event.end).format("HH:mm")} di `
  }

  const lastsMoreDaysDisplayHour = () => {
    if (event.lastsMoreDays.num === 1) return <h1 className="text-base font-bold">Dalle {dayjs(event.begin).format("HH:mm")}</h1>
    else if (event.lastsMoreDays.num === event.lastsMoreDays.total) return <h1 className="text-base font-bold">Fino alle {dayjs(event.end).format("HH:mm")}</h1>
  }

  const multipleDaysEventBegin = (event) => multipleDaysEventBeginHour(event) + multipleDaysEventBeginDate(event)
  const multipleDaysEventEnd = (event) => multipleDaysEventEndHour(event) + multipleDaysEventEndDate(event)
  
  const begin = dayjs(event.begin)
  const end = dayjs(event.end)
  const text_color = colors.labelsTextContrast[event.label]
  const daysFromBegin = Math.ceil(currentDate.diff(dayjs(event.begin))/(1000*60*60*24))+1

  const goToEvent = (event) => {
    const eventDay = begin.startOf("day")
    setSelectedDay(eventDay)
    setSelectedEvent(event)
    setShowEventsList(true)
    setCalendarDate(eventDay.startOf("month"))
    navigate("/calendar")
  }

  const timeSpan = () => {
    if (begin.startOf("minute").isSame(end.startOf("minute"))) return begin.format("HH:mm") 
    else return `${begin.format("HH:mm")} ~ ${end.format("HH:mm")}`
  }

  return (
  <div className={`w-screen px-3`}>
    <div className={`flex flex-col border-2 ${colors.labelsBorder[event.label]} rounded-lg overflow-hidden mb-4`} style={{scrollbarWidth: "none"}}>
      <div className={`py-2 ${colors.labelsBackground[event.label]}`}>
        <div className="mb-1 flex items-center justify-center">
          { event.lastsMoreDays ?
            <div className="flex flex-col">
              <span className={`${text_color} text-sm`}>{multipleDaysEventBegin(event)}</span>
              <span className={`${text_color} text-sm`}>{multipleDaysEventEnd(event)}</span>
            </div>
            : isDateToday(begin) ? <span className={text_color}>Oggi</span>
            : <span className={`${text_color} text-sm`}>{begin.format("dddd D MMMM YYYY")}</span>
          }
        </div>
        <div className="flex flex-col items-center">
          <div className={`flex mb-1 ${colors.labelsTextContrast[event.label]}`}>
            <div className="flex items-center space-x-2">
              { event.isTask && <input type="checkbox" checked={false} onChange={handleCompleteTask} className="w-4 h-4 cursor-pointer"/> }
              <span className="font-bold cursor-pointer hover:underline underline-offset-4 w-fit" onClick={goToEvent}>{truncateLongText(event.title, 50)}</span>
            </div>
            { (event.lastsMoreDays && !begin.isAfter(currentDate)) && <span className="translate-y-1 font-normal text-xs">&nbsp;&nbsp;({daysFromBegin}/{event.lastsMoreDays.total})</span> }
          </div>
          <div className="flex flex-col justify-center">
            { (!event.allDay && !event.lastsMoreDays) && <span className={`text-sm ${text_color}`}>{timeSpan()}</span> }
          </div>
        </div>
      </div>
      <span className={`px-3 ${event.description && "py-1"} text-gray-300 self-center text-center overflow-auto`} style={{scrollbarWidth: "none"}}>{truncateLongText(event.description, 100)}</span>
    </div>
  </div>
  )

}

const EventsView = ({ tasks }) => {
  const { allEvents, currentDate } = useContext(GlobalContext)

  const isNowBetweenDate = (event) => {
    const begin = dayjs(event.begin).valueOf()
    const end = dayjs(event.end).valueOf()
    const now = currentDate.valueOf()
    return event.lastsMoreDays && begin <= now && end >= now
  }

  const now = currentDate.valueOf()
  const eventsOrTasks = allEvents.filter(e => {
    if (tasks) return (e.isTask && !e.isTask.completed)
    else return !e.isTask
  })
  const neighEvents = eventsOrTasks.filter(e => e.begin >= now || isNowBetweenDate(e))
  const notAllMultipleDaysEvents = neighEvents.filter(e => !e.lastsMoreDays || e.lastsMoreDays.num === 1)
  const sortedEvents = notAllMultipleDaysEvents.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
  const limitedEvents = sortedEvents.slice(0, MAX_EVENTS_NUM)

  return (
  <div className={`${colors.MAIN_BORDER_LIGHT} w-screen h-[620px] h-fit p-6 md:basis-1/2 overflow-auto overscroll-none`} style={{scrollbarWidth: "none"}}>
    <div className="flex flex-col justify-center items-center w-full">
      { limitedEvents.length === 0 ? 
        <p className="p-6 text-4xl text-center">Non ci sono {tasks ? "attività" : "eventi"} per i prossimi giorni</p>
        :
        <div> { limitedEvents.map((e,i) => <EventEntry key={i} event={e}/>) } </div>
      }
    </div>
  </div>
  )
}

const NoteEntry = ({ note }) => {
  const navigate = useNavigate()

  const goToNote = (n) => {
    alert("TODO")
    navigate("/notes")
  }

  return (
  <div className={`w-screen px-3`}>
    <div className={`flex flex-col border ${colors.MAIN_BORDER_LIGHT} rounded-lg overflow-hidden mb-4`} style={{scrollbarWidth: "none"}}>
      <div className={`py-2 ${colors.MAIN_BG_DARK}`}>
        <div className="flex flex-col items-center">
          <div className={`mb-1 ${colors.MAIN_TEXT_LIGHT}`}>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold cursor-pointer hover:underline underline-offset-4 w-fit" onClick={goToNote}>{truncateLongText(note.title, 50)}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-center">{truncateLongText(note.content, 200)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

const note_prova = [
  {
    _id: 1,
    title:"Nota di Prova",
    content:"Ciao sono una nota di prova :)",
    createAt: dayjs().subtract(1, "hour"),
    updateAt: dayjs().subtract(1, "hour")
  },
  {
    _id: 2,
    title:"La nota lunga", 
    content:"Anche io sono una nota di prova, ma decisamente più lunga, ciao Riccardo è molto divertente fare il museo con te, eccoci qui, pronti, PEFFOZZA.", 
    createAt: dayjs().subtract(1, "hour"),
    updateAt: dayjs().subtract(30, "minute")
  },
  {
    _id: 3, 
    title:"Nota corta 1", 
    content:"Nota corta 1", 
    createAt: dayjs(),
    updateAt: dayjs()
  },
  {
    _id: 4,
    title:"Nota corta 2", 
    content:"Nota corta 2",
    createAt: dayjs().subtract(4, "hour"),
    updateAt: dayjs()
  }
]

//TODO cambia note_prova
const NotesView = () => {
  const sortedNotes = note_prova.sort((a,b) => {
    const update_diff = dayjs(b.updateAt).diff(dayjs(a.updateAt))
    const create_diff = dayjs(b.createAt).diff(dayjs(a.createAt))
    return update_diff !== 0 ? update_diff : create_diff
  })

  return (
  <div className={`${colors.MAIN_BORDER_LIGHT} w-screen h-[620px] h-fit p-6 md:basis-1/2 overflow-auto overscroll-none`} style={{scrollbarWidth: "none"}}>
    <div className="flex flex-col justify-center items-center w-full">
      { sortedNotes.length === 0 ? 
        <>
          <p className="p-6 text-4xl text-center">Non hai mai creato una nota.</p>
          <p className="p-6 text-4xl text-center">Vai nella sezione dedicata.</p>
        </>
        :
        <div> { sortedNotes.map(n => <NoteEntry key={n._id} note={n}/>) } </div>
      }
    </div>
  </div>
  )
}

const PomodoroEntry = ({ pomodoro }) => {
  const navigate = useNavigate()

  const goToPomodoro = (n) => {
    alert("TODO")
    navigate("/pomodoro")
  }

  return (
  <div className={`w-screen px-3`}>
    <div className={`flex flex-col border ${colors.MAIN_BORDER_LIGHT} rounded-lg overflow-hidden mb-4`} style={{scrollbarWidth: "none"}}>
      <div className={`py-2 ${colors.MAIN_BG_DARK}`}>
        <div className="mb-1 flex items-center justify-center">
        </div>
        <div className="flex flex-col items-center">
          <div className={`mb-1 ${colors.MAIN_TEXT_LIGHT}`}>
            <div className="flex items-center space-x-2">
              <span className="font-bold cursor-pointer hover:underline underline-offset-4 w-fit" onClick={goToPomodoro}>{truncateLongText(pomodoro.title, 50)}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div>Cicli: {pomodoro.cycle.n}</div>
            <div>Azione: {pomodoro.cycle.do}</div>
            <div>Nullafacenza: {pomodoro.cycle.pause}</div>
          </div>
        </div>
      </div>
      <span className={`px-3 ${pomodoro.comment && "py-1"} text-gray-300 self-center overflow-auto`} style={{scrollbarWidth: "none"}}>{truncateLongText(pomodoro.comment, 50)}</span>
    </div>
  </div>
  )
}

const pomodoros_prova = [
  {
    _id: 1,
    title:"Studio Linguaggi",
    from: dayjs().subtract(1, "hour"),
    to: dayjs(),
    cycle: {
      n: 4,
      do: 25,
      pause: 5
    },
    comment: "Poteva andare peggio"
  },
  {
    _id: 2,
    title:"Studio Tecnologie Web",
    from: dayjs().subtract(4, "hour"),
    to: dayjs().subtract(2, "hour"),
    cycle: {
      n: 2,
      do: 20,
      pause: 10
    },
    comment: "Tanto è facile"
  },
]

const PomodoroView = () => {
  const sortedPomodoros = pomodoros_prova.sort((a,b) => {
    const update_diff = dayjs(b.updateAt).diff(dayjs(a.updateAt))
    const create_diff = dayjs(b.createAt).diff(dayjs(a.createAt))
    return update_diff !== 0 ? update_diff : create_diff
  })

  return (
  <div className={`${colors.MAIN_BORDER_LIGHT} w-screen h-[620px] h-fit p-6 md:basis-1/2 overflow-auto overscroll-none`} style={{scrollbarWidth: "none"}}>
    <div className="flex flex-col justify-center items-center w-full">
      { sortedPomodoros.length === 0 ? 
        <>
          <p className="p-6 text-4xl text-center">Non hai mai fatto un Pomodoro.</p>
          <p className="p-6 text-4xl text-center">Vai nella sezione dedicata.</p>
        </>
        :
        <div> { sortedPomodoros.map(p => <PomodoroEntry key={p._id} pomodoro={p}/>) } </div>
      }
    </div>
  </div>
  )
}

export default function Home()
{
  useCheckForUser()

  var { user, allEvents, allEvents_initialize } = useContext(GlobalContext)
  const navigate = useNavigate()
  const views = {
    names: ["Eventi", "Attività", "Note", "Pomodoro"],
    descs: ["Prossimi Eventi", "Prossime Attività", "Ultime Note", "Sessioni Pomodoro"],
    tags: [<EventsView/>, <EventsView tasks={true}/>, <NotesView/>, <PomodoroView/>]
  }
  const [currentViewIndex, setCurrentViewIndex] = useState(0)

  const goToInitialPage = () => {
    navigate("/")
  }

  useEffect(() => {
    if (!user) goToInitialPage()
    allEvents_initialize()
  }, [user, allEvents, currentViewIndex])

  const change_view_left = () => {
    const newView = (currentViewIndex-1+views.names.length) % views.names.length
    setCurrentViewIndex(newView)
  }
  const change_view_right = () => {
    const newView = (currentViewIndex+1) % views.names.length
    setCurrentViewIndex(newView)
  }

  const formatViewDescription = (desc) => {
    const [part1, part2] = desc.split(' ')
    return (
    <div className="flex flex-col leading-none">
      <span>{part1}</span>
      <span>{part2}</span>
    </div>
    )
  }

  return (
    <>
    <Header/>

    <div className="overflow-auto" style={{scrollbarWidth:"none"}}>
      <div className="w-screen pb-6 border-b-2 flex text-5xl md:text-6xl justify-around md:space-x-8">
        <p className="md:pl-10 select-none" onClick={change_view_left}>‹</p>
        <div className="md:w-full translate-y-[5px] flex items-center justify-center space-x-4 md:space-x-16 text-center">
          { views.names.map((v, i) => <span key={i} onClick={() => setCurrentViewIndex(i)} className={`${v === views.names[currentViewIndex] ? "text-xl md:text-3xl" : "text-xs"}`}>
              {formatViewDescription(views.descs[i])}
          </span>) }
        </div>
        <p className="md:pr-10 select-none" onClick={change_view_right}>›</p>
      </div>
      { views.tags[currentViewIndex] }
    </div>
    </>
  )
}
