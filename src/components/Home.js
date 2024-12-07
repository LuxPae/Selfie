// [TODO]
// - validators per user
// - grandezza eventslist (in generale sistemare le dimensioni delle parti del calendario)
// - eventslist (la parte nella freccetta)
// - colori ovunque (lo faccio?)
// - import / export as ICS ?
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

  return (
  <div className={`w-screen px-3`}>
    <div className={`flex flex-col border ${colors.labelsBorder[event.label]} rounded-lg overflow-hidden mb-4`} style={{scrollbarWidth: "none"}}>
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
          <div className={`mb-1 ${colors.labelsTextContrast[event.label]}`}>
            <div className="flex items-center space-x-2">
              { event.isTask && <input type="checkbox" checked={false} onChange={handleCompleteTask} className="w-4 h-4 cursor-pointer"/> }
              <span className="font-bold cursor-pointer hover:underline underline-offset-4 w-fit" onClick={goToEvent}>{truncateLongText(event.title, 50)}</span>
            </div>
            { (event.lastsMoreDays && !begin.isAfter(currentDate)) && <span className="-translate-y-px font-normal text-xs">&nbsp;&nbsp;({daysFromBegin}/{event.lastsMoreDays.total})</span> }
          </div>
          <div className="flex flex-col justify-center">
            { (!event.allDay && !event.lastsMoreDays) && <span className={`text-sm ${text_color}`}>{begin.format("HH:mm")} ~ {end.format("HH:mm")}</span> }
          </div>
        </div>
      </div>
      <span className={`px-3 ${event.description && "py-1"} text-gray-300 self-center overflow-auto`} style={{scrollbarWidth: "none"}}>{truncateLongText(event.description, 100)}</span>
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
  const sortedEvents = neighEvents.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
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
      <div className={`py-2 ${colors.MAIN_BG}`}>
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
      <div className={`py-2 ${colors.MAIN_BG}`}>
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

  //TODO togli e cambia
  //const getCurrentDate = () => {
  //  currentDate = dayjs(JSON.parse(localStorage.getItem("currentDate")))
  //  if (!currentDate) error = "Non è stato possibile caricare la pagina"
  //}

  //TODO togli e cambia
  //const clearHomeInfoInStorage = () => {
  //  localStorage.removeItem("event_from_home")
  //  localStorage.removeItem("note_from_home")
  //}

  const goToInitialPage = () => {
    navigate("/")
  }

  //const NoteTemplate = (note) => {
  //  return (
  //`<div id="note_${note._id}" className="hover:animate-pulse bg-gradient-to-b hover:bg-gradient-to-t ${colors.HOME_GRADIENT_1} ${colors.HOME_GRADIENT_2} p-4 rounded-lg border ${colors.MAIN_BORDER_DARK} mb-4">
  //  <div className="flex flex-row justify-between">
  //    <h2 className="text-left text-xl font-semibold mb-2">${note.title}</h2>
  //    <div>
  //      <p className="text-gray-400 text-left text-xs"><strong>Creata il:</strong> ${dateFormat(note.createAt)}</p>
  //      <p className="text-gray-400 text-left text-xs mb-2"><strong>Modificata il:</strong> ${dateFormat(note.updateAt)}</p>
  //    </div>
  //  </div>
  //  <p className="text-left mx-5 mt-2 text-gray-200">${truncateLongText(note.content, note_content_max_chars)}</p>
  //</div>`)
  //}

  //const formatTaskDate = (task) => {
  //  const begin = dayjs(task.begin)
  //  const text_color = colors.labelsTextContrast[task.label]
  //  if (isDateToday(task.begin)) return `<span className="${text_color}">Oggi</span>`
  //  else return (
  //    `<span className="${text_color}">${begin.format("ddd D")}</span> 
  //     <span className="${text_color}">${begin.format("MMM YY")}</span>`
  //  )
  //}
  //const formatTaskHours = (task) => {
  //  const text_color = colors.labelsTextContrast[task.label]
  //  if (!task.allDay) return `<span className="${text_color}">${dayjs(task.begin).format("HH:mm")}</span>`
  //}

  //const TaskTemplate = (task) => {
  //  return (
  //`<div className="flex flex-col border ${colors.labelsBorder[task.label]} rounded-lg overflow-hidden mb-4">
  //  <div className="p-1 ${colors.labelsBackground[task.label]}">
  //    <div className="flex items-center justify-around">
  //      <div className="flex flex-col justify-center">${formatTaskDate(task)}</div>
  //      <span id="click_task_${task._id}" className="max-w-fit ${colors.labelsTextContrast[task.label]} cursor-pointer hover:underline underline-offset-4 w-1/2">${truncateLongText(task.title, 50)}</span>
  //      <div className="flex flex-col justify-center">${formatTaskHours(task)}</div>
  //    </div>
  //  </div>
  //  <span className="px-3 text-gray-300 self-center overflow-auto" style="scrollbar-width: none">${truncateLongText(task.description, 100)}</span>
  //</div>`
  //  )
  //}
  //const TaskTemplate = (task) => {
  //  return (
  //`<div className="flex flex-col border ${colors.labelsBorder[task.label]} rounded-lg overflow-hidden mb-4">
  //  <div className="py-2 ${colors.labelsBackground[task.label]}">
  //    <div className="mb-1">${formatEventDate(task)}</div>
  //    <div className="flex flex-col items-center">
  //      <span id="click_task_${task._id}" className="mb-1 ${colors.labelsTextContrast[task.label]} cursor-pointer hover:underline underline-offset-4 w-fit">${formatTitle(task)}</span>
  //      <div className="flex flex-col justify-center">${formatEventHours(task)}</div>
  //    </div>
  //  </div>
  //  <span className="px-3 ${descriptionPadding(task)} text-gray-300 self-center overflow-auto" style="scrollbar-width: none">${truncateLongText(task.description, 100)}</span>
  //</div>`
  //  )
  //}

  //const dateFormat = (date) => dayjs(date).format("dddd DD MMMM YYYY")+" alle "+dayjs(date).format("HH:mm")
  
  //const createNotesPreview = () => {
  //  let notes = document.getElementById("notes")
  //  notes.replaceChildren()
  //  let i = 0
  //  while (i < max_notes && i < note_prova.length) {
  //    notes.innerHTML += NoteTemplate(note_prova[i])
  //    i++
  //  }
  //
  //  for (let note of note_prova) {
  //    let note_node = document.getElementById(`note_${note._id}`)
  //    if (note_node) note_node.addEventListener("click", () => goToNote(note))
  //  }
  //}

  //const createEventsPreview = () => {
  //  let events_div = document.getElementById("events")
  //  events_div.replaceChildren()
  //  events = allEvents.filter(e => !e.isTask)
  //  const now = currentDate.valueOf()
  //  const neigh_events = events.filter(e => e.begin >= now || isNowBetweenDate(e))
  //  const sorted_events = neigh_events.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
  //  const limited_events = sorted_events.slice(0, MAX_EVENTS_NUM)
  //  if (limited_events.length === 0) {
  //    events_div.innerHTML = "<p>Non ci sono eventi per i prossimi giorni</p>"
  //    return
  //  }
  //  for (let event of limited_events) {
  //    events_div.innerHTML += EventTemplate(event)
  //  }
  //
  //  for (let event of events) {
  //    let event_node = document.getElementById(`click_event_${event._id}`)
  //    if (event_node) event_node.addEventListener("click", () => goToEvent(event))
  //  }
  //}

  //const createTasksPreview = () => {
  //  let tasks_div = document.getElementById("tasks")
  //  tasks_div.replaceChildren()
  //  tasks = allEvents.filter(e => e.isTask)
  //  const now = currentDate.valueOf()
  //  const neigh_tasks = tasks.filter(t => t.begin >= now || isNowBetweenDate(t))
  //  const sorted_tasks = neigh_tasks.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
  //  const not_completed_tasks = sorted_tasks.filter(t => !t.isTask.completed)
  //  const limited_tasks = not_completed_tasks.slice(0, MAX_EVENTS_NUM)
  //  if (limited_tasks.length === 0) {
  //    tasks_div.innerHTML = "<p>Non ci sono attività per i prossimi giorni</p>"
  //    return
  //  }
  //  for (let task of limited_tasks) {
  //    tasks_div.innerHTML += TaskTemplate(task)
  //  }
  //
  //  for (let task of tasks) {
  //    let task_node = document.getElementById(`click_task_${task._id}`)
  //    if (task_node) task_node.addEventListener("click", () => goToEvent(task))
  //  }
  //}

  ////TODO? non è così importante
  //const createEmptyPage = () => {
  //  let events_div = document.getElementById("events")
  //  events_div.replaceChildren()
  //  const emptyEvent = 
  //    `<div className="border border-gray-600 animate-pulse">
  //       <p></p> 
  //    </div>`
  //  for (let i = 0; i < 4; i++) events_div.innerHTML += emptyEvent
  //}
  //

  //const initializeChangeView = () => {
  //  const left_div = document.getElementById("change_view_left")
  //  left_div.addEventListener("click", () => {
  //    if (!change_left_clicked) {
  //      current_view_index = (current_view_index-1+views.length) % views.length;      
  //      current_view = views[current_view_index]
  //      renderView()
  //      change_left_clicked = true
  //    } else change_left_clicked = false
  //  })
  //  const right_div = document.getElementById("change_view_right")
  //  right_div.addEventListener("click", () => {
  //    if (!change_right_clicked) {
  //      current_view_index = (current_view_index+1) % views.length;      
  //      current_view = views[current_view_index]
  //      renderView()
  //      change_right_clicked = true
  //    } else change_right_clicked = false
  //  })
  //}

  ////TODO cambia il colore di sfondo
  //const renderView = () => {
  //  const bollini_div = views.map(view_name => ({div:document.getElementById(`bollino_${view_name}`), name:view_name}))
  //  bollini_div.map(b => {
  //    if (b.name === current_view) {
  //      b.div.classList.add("bg-white")
  //      const current_view_div = document.getElementById(`view_${b.name}`)
  //      current_view_div.classList.add("block")
  //      current_view_div.classList.remove("hidden")
  //    }
  //    else {
  //      b.div.classList.remove("bg-white")
  //      const not_current_view_div = document.getElementById(`view_${b.name}`)
  //      not_current_view_div.classList.add("hidden")
  //      not_current_view_div.classList.remove("block")
  //    }
  //  })
  //}

  //const createEventsView = () => {
  //  const container = document.getElementById("view_eventi")
  //  container.replaceChildren()
  //  container.innerHTML = `
  //  <div className="flex justify-center">Eventi</div> 
  //  `
  //  const events_div = document.createElement("div")
  //  events = allEvents.filter(e => !e.isTask)
  //  const now = currentDate.valueOf()
  //  const neigh_events = events.filter(e => e.begin >= now || isNowBetweenDate(e))
  //  const sorted_events = neigh_events.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
  //  const limited_events = sorted_events.slice(0, MAX_EVENTS_NUM)
  //  if (limited_events.length === 0) {
  //    events_div.innerHTML += "<p>Non ci sono eventi per i prossimi giorni</p>"
  //    return
  //  }
  //  for (let event of limited_events) {
  //    events_div.innerHTML += EventTemplate(event)
  //  }
  //
  //  for (let event of events) {
  //    let event_node = document.getElementById(`click_event_${event._id}`)
  //    if (event_node) event_node.addEventListener("click", () => goToEvent(event))
  //  }
  //  container.appendChild(events_div)
  //}

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

/*
    <div className="">
      <div className="flex flex-col place-items-center text-center w-screen pb-6 border-b-2">
        <div className="flex place-items-center text-5xl md:text-6xl justify-between md:space-x-8">
          <p className="select-none" onClick={change_view_left}>‹</p>
          <div className="md:w-full translate-y-[5px] flex space-x-4 md:space-x-8 items-center justify-center">
            { views.names.map((v, i) => <span key={i} className={`${v === views.names[currentViewIndex] ? "text-xl md:text-3xl" : "text-xs"}`}>{formatViewDescription(views.descs[i])}</span>) }
          </div>
          <p className="select-none" onClick={change_view_right}>›</p>
        </div>
      </div>
    { views.tags[currentViewIndex] }
    </div>
*/
