// [TODO]
// - tiny scrollbars for notes and events
import * as colors from "../scripts/COLORS.js"
import { MAX_EVENTS_NUM } from "../scripts/CONSTANTS.js"
import { useEffect } from "react"
import { getAllEvents } from "../API/events.js"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const HomeVanilla = () => {

  const navigate = useNavigate()
  var currentDate = null
  var user = null
  var allEvents = []
  var events = []
  var tasks = []
  var error = ""

  const getCurrentDate = () => {
    currentDate = dayjs(JSON.parse(localStorage.getItem("currentDate")))
    if (!currentDate) error = "Non è stato possibile caricare la pagina"
  }

  const clearHomeInfoInStorage = () => {
    localStorage.removeItem("event_from_home")
    localStorage.removeItem("note_from_home")
  }

  const goToInitialPage = () => {
    navigate("/")
  }
  const goToEvent = (event) => {
    //console.log("Event from home:", event)
    if (event) {
      localStorage.setItem("event_from_home", JSON.stringify({...event}))
    }
    //console.log(localStorage.getItem("event_from_home"))
    navigate("/calendar")
  }
  //TODO come in Calendar
  const goToNote = (note) => {
    if (note) {
      localStorage.setItem("note_from_home", JSON.stringify({...note}))
      console.log("set note from home", JSON.parse(localStorage.getItem("note_from_home")))
    } 
    navigate("/notes")
  }
  
  const note_content_max_chars = 100
  const truncateLongText = (text, max_chars) => text.length <= max_chars ? text : text.slice(0, max_chars)+"..."
  
  const fetchProfile = () => user = JSON.parse(localStorage.getItem("user"))
  const fetchEvents = () => {
    getAllEvents(user)
      .then(fetchedEvents => {
        allEvents = fetchedEvents
        createEventsPreview()
        createTasksPreview()
      })
      .catch(error => {
        console.error(error.message)
        error = error.message
      })
  }
  
  const note_prova = [
    {
      _id: 1,
      title:"Nota di Prova",
      content:"Ciao sono una nota di prova :)",
      createAt: dayjs(new Date(2024, 5, 27)).valueOf(),
      updateAt: dayjs(new Date(2024, 5, 27)).valueOf(),
    },
    {
      _id: 2,
      title:"La nota lunga", 
      content:"Anche io sono una nota di prova, ma decisamente più lunga, ciao Riccardo è molto divertente fare il museo con te, eccoci qui, pronti, PEFFOZZA.", 
      createAt: dayjs(new Date(2024, 5, 27)).valueOf(),
      updateAt: dayjs(new Date(2024, 5, 27)).valueOf(),
    },
    {
      _id: 3, 
      title:"Nota corta 1", 
      content:"Nota corta 1", 
      createAt: dayjs(new Date(2024, 5, 27)).valueOf(),
      updateAt: dayjs(new Date(2024, 5, 27)).valueOf(),
    },
    {
      _id: 4,
      title:"Nota corta 2", 
      content:"Nota corta 2",
      createAt: dayjs(new Date(2024, 5, 27)).valueOf(),
      updateAt: dayjs(new Date(2024, 5, 27)).valueOf(),
    }
  ]
  
  const max_notes = 3
  const NoteTemplate = (note) => {
    return (
  `<div id="note_${note._id}" class="hover:animate-pulse bg-gradient-to-b hover:bg-gradient-to-t ${colors.HOME_GRADIENT_1} ${colors.HOME_GRADIENT_2} p-4 rounded-lg border ${colors.MAIN_BORDER_DARK} mb-4">
    <div class="flex flex-row justify-between">
      <h2 class="text-left text-xl font-semibold mb-2">${note.title}</h2>
      <div>
        <p class="text-gray-400 text-left text-xs"><strong>Creata il:</strong> ${dateFormat(note.createAt)}</p>
        <p class="text-gray-400 text-left text-xs mb-2"><strong>Modificata il:</strong> ${dateFormat(note.updateAt)}</p>
      </div>
    </div>
    <p class="text-left mx-5 mt-2 text-gray-200">${truncateLongText(note.content, note_content_max_chars)}</p>
  </div>`)
  }
  
  const formatEventDate = (event) => {
    const begin = dayjs(event.begin)
    const text_color = colors.labelsTextContrast[event.label]
    if (dayjs(event.begin).startOf("day").isSame(currentDate.startOf("day"))) return `<span class="${text_color}">Oggi</span>`
    else return (
      `<span class="${text_color}">${begin.format("ddd D")}</span> 
       <span class="${text_color}">${begin.format("MMM YY")}</span>`
    )
  }
  const formatEventHours = (event) => {
    const text_color = colors.labelsTextContrast[event.label]
    if (event.allDay) return `<span class="${text_color} flex flex-col"><span>Tutto</span><span>il giorno</span></span>`
    else {
      const begin = dayjs(event.begin)
      const end = dayjs(event.end)
      return (
        `<span class="${text_color} border-b ${colors.labelsBorderContrast[event.label]}">${begin.format("HH:mm")}</span>
         <span class="${text_color}">${end.format("HH:mm")}</span>`
      )
    }
  }

  const EventTemplate = (event) => {
    return (
  `<div class="flex flex-col border ${colors.labelsBorder[event.label]} rounded-lg overflow-hidden mb-4">
    <div class="p-1 ${colors.labelsBackground[event.label]}">
      <div class="flex items-center justify-around">
        <div class="flex flex-col justify-center">${formatEventDate(event)}</div>
        <span id="click_event_${event._id}" class="${colors.labelsTextContrast[event.label]} cursor-pointer hover:underline underline-offset-4 w-1/2">${truncateLongText(event.title, 50)} (più giorni? TODO)</span>
        <div class="flex flex-col justify-center">${formatEventHours(event)}</div>
      </div>
    </div>
    <span class="px-3 text-gray-300 self-center overflow-auto" style="scrollbar-width: none">${truncateLongText(event.description, 100)}</span>
  </div>`
    )
  }

  const formatTaskDate = (task) => {
    const begin = dayjs(task.begin)
    const text_color = colors.labelsTextContrast[task.label]
    if (dayjs(task.begin).startOf("day").isSame(currentDate.startOf("day"))) return `<span class="${text_color}">Oggi</span>`
    else return (
      `<span class="${text_color}">${begin.format("ddd D")}</span> 
       <span class="${text_color}">${begin.format("MMM YY")}</span>`
    )
  }
  const formatTaskHours = (task) => {
    const text_color = colors.labelsTextContrast[task.label]
    if (task.allDay) return `<span class="${text_color} flex flex-col"><span>Tutto</span><span>il giorno</span></span>`
    else return `<span class="${text_color}">${dayjs(task.begin).format("HH:mm")}</span>`
  }

  const TaskTemplate = (task) => {
    return (
  `<div class="flex flex-col border ${colors.labelsBorder[task.label]} rounded-lg overflow-hidden mb-4">
    <div class="p-1 ${colors.labelsBackground[task.label]}">
      <div class="flex items-center justify-around">
        <div class="flex flex-col justify-center">${formatTaskDate(task)}</div>
        <span id="click_task_${task._id}" class="max-w-fit ${colors.labelsTextContrast[task.label]} cursor-pointer hover:underline underline-offset-4 w-1/2">${truncateLongText(task.title, 50)} (più giorni? TODO)</span>
        <div class="flex flex-col justify-center">${formatTaskHours(task)}</div>
      </div>
    </div>
    <span class="px-3 text-gray-300 self-center overflow-auto" style="scrollbar-width: none">${truncateLongText(task.description, 100)}</span>
  </div>`
    )
  }

  const dateFormat = (date) => dayjs(date).format("dddd DD MMMM YYYY")+" alle "+dayjs(date).format("HH:mm")
  
  const createNotesPreview = () => {
    let notes = document.getElementById("notes")
    notes.replaceChildren()
    let i = 0
    while (i < max_notes && i < note_prova.length) {
      notes.innerHTML += NoteTemplate(note_prova[i])
      i++
    }
  
    for (let note of note_prova) {
      let note_node = document.getElementById(`note_${note._id}`)
      if (note_node) note_node.addEventListener("click", () => goToNote(note))
    }
  }
  
  const createEventsPreview = () => {
    let events_div = document.getElementById("events")
    events_div.replaceChildren()
    events = allEvents.filter(e => !e.isTask)
    if (events.length === 0) {
      events_div.innerHTML = "<p>Non ci sono eventi per i prossimi giorni</p>"
      return
    }
    const now = currentDate.valueOf()
    const neigh_events = events.filter(e => e.begin >= now)
    const sorted_events = neigh_events.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
    const limited_events = sorted_events.slice(0, MAX_EVENTS_NUM)
    for (let event of limited_events) {
      events_div.innerHTML += EventTemplate(event)
    }
  
    for (let event of events) {
      let event_node = document.getElementById(`click_event_${event._id}`)
      if (event_node) event_node.addEventListener("click", () => goToEvent(event))
    }
  }

  const createTasksPreview = () => {
    let tasks_div = document.getElementById("tasks")
    tasks_div.replaceChildren()
    tasks = allEvents.filter(e => e.isTask)
    if (tasks.length === 0) {
      tasks_div.innerHTML = "<p>Non ci sono attività per i prossimi giorni</p>"
      return
    }
    const now = currentDate.valueOf()
    const neigh_tasks = tasks.filter(t => t.begin >= now)
    const sorted_tasks = neigh_tasks.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
    const not_completed_tasks = sorted_tasks.filter(t => !t.isTask.completed)
    const limited_tasks = not_completed_tasks.slice(0, MAX_EVENTS_NUM)
    for (let task of limited_tasks) {
      tasks_div.innerHTML += TaskTemplate(task)
    }
  
    for (let task of tasks) {
      let task_node = document.getElementById(`click_task_${task._id}`)
      if (task_node) task_node.addEventListener("click", () => goToEvent(task))
    }
  }

  //TODO? non è così importante
  const createEmptyPage = () => {
    let events_div = document.getElementById("events")
    events_div.replaceChildren()
    const emptyEvent = 
      `<div class="border border-gray-600 animate-pulse">
         <p></p> 
      </div>`
    for (let i = 0; i < 4; i++) events_div.innerHTML += emptyEvent
  }
  
  const setUserInfo = () => {
    fetchProfile()
    if (!user) goToInitialPage()
  
    fetchEvents()
    //TODO come sopra, ci sarà fetchNotes
    createNotesPreview()
  }

  useEffect(() => {
    getCurrentDate()
    clearHomeInfoInStorage()
    createEmptyPage()
    setUserInfo()
  }, [])

  return (
    <>
    <div className="flex items-center text-center justify-center h-full">
      <div className="flex flex-col md:flex-row mt-10 max-h-[600px] min-h-[600px]">
        <div id="events_container" style={{scrollbarWidth: "thin"}} className={`border-2 ${colors.MAIN_BORDER_LIGHT} w-full h-[600px] rounded-md p-6 md:basis-1/2 overflow-auto`}>
          <h1 className="text-3xl text-white font-bold text-center mb-6 justify-start">Eventi</h1>
          <div id="events" className="flex flex-col justify-around"></div>
        </div>
        <div id="tasks_container" className={`border-2 ${colors.MAIN_BORDER_LIGHT} w-full h-[600px] rounded-md p-6 md:basis-1/2`}>
          <h1 className="text-3xl font-bold text-center mb-6">Attività</h1>
          <div id="tasks"></div>
        </div>
      </div>
    </div>
    <div id="notes_container" className={`border-2 ${colors.MAIN_BORDER_LIGHT} w-full rounded-md text-white p-6 basis-1/2`}>
      <h1 className="text-3xl font-bold text-center mb-6">Le mie note</h1>
      <div id="notes"></div>
    </div>
    </>
  )
}

export default HomeVanilla
