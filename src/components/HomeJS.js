import * as colors from "../scripts/COLORS.js"
import { MAX_EVENTS_NUM } from "../scripts/CONSTANTS.js"
import {useContext, useEffect} from "react"
import { getAllEvents } from "../API/events.js"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import {getNotes} from "../API/note";
import GlobalContext from "../context/GlobalContext";

const HomeVanilla = () => {

  const navigate = useNavigate()
  var currentDate = null
  var user = null
  var allEvents = []
  var events = []
  var tasks = []
  var error = ""
  const views = ["eventi", "attività", "note", "pomodoro"]
  var current_view_index = 0
  var current_view = views[current_view_index]
  var change_left_clicked = false
  var change_right_clicked = false

  const token = useContext(GlobalContext).user.token;

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
  //TD come in Calendar
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
        //TD
        //createEventsPreview()
        createEventsView()
        //createTasksPreview()
        createTasksView()
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

  const formatEventDate = (event) => {
    const begin = dayjs(event.begin)
    const end = dayjs(event.end)
    const text_color = colors.labelsTextContrast[event.label]
    if (event.lastsMoreDays) {
      return (`
      <div class="flex flex-col">
        <span class="${text_color} text-sm">${multipleDaysEventBegin(event)}</span>
        <span class="${text_color} text-sm">${multipleDaysEventEnd(event)}</span>
      </div>
      `)
    }
    else if (isDateToday(event.begin)) return `<span class="${text_color}">Oggi</span>`
    else return (
      `<span class="${text_color} text-sm">${begin.format("dddd D MMMM YYYY")}</span>`
    )
  }
  const formatEventHours = (event) => {
    const text_color = colors.labelsTextContrast[event.label]
    if (!event.allDay && !event.lastsMoreDays) {
      const begin = dayjs(event.begin)
      const end = dayjs(event.end)
      return (
        `<span class="text-sm ${text_color}">${begin.format("HH:mm")} / ${end.format("HH:mm")}</span>`
      )
    } else return ""
  }

  const lastsMoreDaysEventTitle = (event) => {
    if (event.lastsMoreDays && !dayjs(event.begin).isAfter(currentDate)) {
      const num = Math.ceil(currentDate.diff(dayjs(event.begin))/(1000*60*60*24))+1
      console.log("days from begin:", num)
      return `<span class="-translate-y-px font-normal text-xs">&nbsp;&nbsp;(${num}/${event.lastsMoreDays.total})</span>`
    } else return ""
  }

  const formatTitle = (event) => {
    return(`<span class="font-bold">${truncateLongText(event.title, 50)}</span>${lastsMoreDaysEventTitle(event)}`)
  }

  const descriptionPadding = (event) => event.description ? "py-1" : ""

  const EventTemplate = (event) => {
    return (
  `<div class="flex flex-col border ${colors.labelsBorder[event.label]} rounded-lg overflow-hidden mb-4">
    <div class="py-2 ${colors.labelsBackground[event.label]}">
      <div class="mb-1">${formatEventDate(event)}</div>
      <div class="flex flex-col items-center">
        <span id="click_event_${event._id}" class="mb-1 ${colors.labelsTextContrast[event.label]} cursor-pointer hover:underline underline-offset-4 w-fit">${formatTitle(event)}</span>
        <div class="flex flex-col justify-center">${formatEventHours(event)}</div>
      </div>
    </div>
    <span class="px-3 ${descriptionPadding(event)} text-gray-300 self-center overflow-auto" style="scrollbar-width: none">${truncateLongText(event.description, 100)}</span>
  </div>`
    )
  }

  const formatTaskDate = (task) => {
    const begin = dayjs(task.begin)
    const text_color = colors.labelsTextContrast[task.label]
    if (isDateToday(task.begin)) return `<span class="${text_color}">Oggi</span>`
    else return (
      `<span class="${text_color}">${begin.format("ddd D")}</span> 
       <span class="${text_color}">${begin.format("MMM YY")}</span>`
    )
  }
  const formatTaskHours = (task) => {
    const text_color = colors.labelsTextContrast[task.label]
    if (!task.allDay) return `<span class="${text_color}">${dayjs(task.begin).format("HH:mm")}</span>`
  }

  //const TaskTemplate = (task) => {
  //  return (
  //`<div class="flex flex-col border ${colors.labelsBorder[task.label]} rounded-lg overflow-hidden mb-4">
  //  <div class="p-1 ${colors.labelsBackground[task.label]}">
  //    <div class="flex items-center justify-around">
  //      <div class="flex flex-col justify-center">${formatTaskDate(task)}</div>
  //      <span id="click_task_${task._id}" class="max-w-fit ${colors.labelsTextContrast[task.label]} cursor-pointer hover:underline underline-offset-4 w-1/2">${truncateLongText(task.title, 50)}</span>
  //      <div class="flex flex-col justify-center">${formatTaskHours(task)}</div>
  //    </div>
  //  </div>
  //  <span class="px-3 text-gray-300 self-center overflow-auto" style="scrollbar-width: none">${truncateLongText(task.description, 100)}</span>
  //</div>`
  //  )
  //}
  const TaskTemplate = (task) => {
    return (
  `<div class="flex flex-col border ${colors.labelsBorder[task.label]} rounded-lg overflow-hidden mb-4">
    <div class="py-2 ${colors.labelsBackground[task.label]}">
      <div class="mb-1">${formatEventDate(task)}</div>
      <div class="flex flex-col items-center">
        <span id="click_task_${task._id}" class="mb-1 ${colors.labelsTextContrast[task.label]} cursor-pointer hover:underline underline-offset-4 w-fit">${formatTitle(task)}</span>
        <div class="flex flex-col justify-center">${formatEventHours(task)}</div>
      </div>
    </div>
    <span class="px-3 ${descriptionPadding(task)} text-gray-300 self-center overflow-auto" style="scrollbar-width: none">${truncateLongText(task.description, 100)}</span>
  </div>`
    )
  }

  const dateFormat = (date) => dayjs(date).format("dddd DD MMMM YYYY")+" alle "+dayjs(date).format("HH:mm")

  const createNotesPreview = async (token) => {
    const notesList = await getNotes({token: token});

    let notes = document.getElementById("notes")
    notes.replaceChildren()
    let i = 0
    while (i < max_notes && i < notesList.length) {
      notes.innerHTML += NoteTemplate(notesList[i])
      i++
    }

    for (let note of notesList) {
      let note_node = document.getElementById(`note_${note._id}`)
      if (note_node) note_node.addEventListener("click", () => goToNote(note))
    }
  }

  const isNowBetweenDate = (event) => {
    const begin = dayjs(event.begin).valueOf()
    const end = dayjs(event.end).valueOf()
    const now = currentDate.valueOf()
    return event.lastsMoreDays && begin <= now && end >= now
  }

  const createEventsPreview = () => {
    let events_div = document.getElementById("events")
    events_div.replaceChildren()
    events = allEvents.filter(e => !e.isTask)
    const now = currentDate.valueOf()
    const neigh_events = events.filter(e => e.begin >= now || isNowBetweenDate(e))
    const sorted_events = neigh_events.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
    const limited_events = sorted_events.slice(0, MAX_EVENTS_NUM)
    if (limited_events.length === 0) {
      events_div.innerHTML = "<p>Non ci sono eventi per i prossimi giorni</p>"
      return
    }
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
    const now = currentDate.valueOf()
    const neigh_tasks = tasks.filter(t => t.begin >= now || isNowBetweenDate(t))
    const sorted_tasks = neigh_tasks.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
    const not_completed_tasks = sorted_tasks.filter(t => !t.isTask.completed)
    const limited_tasks = not_completed_tasks.slice(0, MAX_EVENTS_NUM)
    if (limited_tasks.length === 0) {
      tasks_div.innerHTML = "<p>Non ci sono attività per i prossimi giorni</p>"
      return
    }
    for (let task of limited_tasks) {
      tasks_div.innerHTML += TaskTemplate(task)
    }

    for (let task of tasks) {
      let task_node = document.getElementById(`click_task_${task._id}`)
      if (task_node) task_node.addEventListener("click", () => goToEvent(task))
    }
  }

  //TD? non è così importante
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
  }

  const initializeChangeView = () => {
    const left_div = document.getElementById("change_view_left")
    left_div.addEventListener("click", () => {
      if (!change_left_clicked) {
        current_view_index = (current_view_index-1+views.length) % views.length;
        current_view = views[current_view_index]
        renderView()
        change_left_clicked = true
      } else change_left_clicked = false
    })
    const right_div = document.getElementById("change_view_right")
    right_div.addEventListener("click", () => {
      if (!change_right_clicked) {
        current_view_index = (current_view_index+1) % views.length;
        current_view = views[current_view_index]
        renderView()
        change_right_clicked = true
      } else change_right_clicked = false
    })
  }

  //TD cambia il colore di sfondo
  const renderView = () => {
    const bollini_div = views.map(view_name => ({div:document.getElementById(`bollino_${view_name}`), name:view_name}))
    bollini_div.map(b => {
      if (b.name === current_view) {
        b.div.classList.add("bg-white")
        const current_view_div = document.getElementById(`view_${b.name}`)
        current_view_div.classList.add("block")
        current_view_div.classList.remove("hidden")
      }
      else {
        b.div.classList.remove("bg-white")
        const not_current_view_div = document.getElementById(`view_${b.name}`)
        not_current_view_div.classList.add("hidden")
        not_current_view_div.classList.remove("block")
      }
    })
  }

  const createEventsView = () => {
    const container = document.getElementById("view_eventi")
    container.replaceChildren()
    container.innerHTML = `
    <div class="flex justify-center">Eventi</div> 
    `
    const events_div = document.createElement("div")
    events = allEvents.filter(e => !e.isTask)
    const now = currentDate.valueOf()
    const neigh_events = events.filter(e => e.begin >= now || isNowBetweenDate(e))
    const sorted_events = neigh_events.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf())
    const limited_events = sorted_events.slice(0, MAX_EVENTS_NUM)
    if (limited_events.length === 0) {
      events_div.innerHTML += "<p>Non ci sono eventi per i prossimi giorni</p>"
      return
    }
    for (let event of limited_events) {
      events_div.innerHTML += EventTemplate(event)
    }

    for (let event of events) {
      let event_node = document.getElementById(`click_event_${event._id}`)
      if (event_node) event_node.addEventListener("click", () => goToEvent(event))
    }
    container.appendChild(events_div)
  }

  const createTasksView = () => {
    const container = document.getElementById("view_attività")
    container.innerHTML = `
    <p>attività</p>
    `
  }

  const createNotesView = () => {
    const container = document.getElementById("view_note")
    container.innerHTML = `
    <p>note</p>
    `
  }

  const createPomodoroView = () => {
    const container = document.getElementById("view_pomodoro")
    container.innerHTML = `
    <p>pomodoro</p>
    `
  }

  useEffect(() => {
    getCurrentDate()
    clearHomeInfoInStorage()

    //createEmptyPage()
    setUserInfo()
    fetchEvents()

    //TD come sopra (ognuno nel suo fetch)
    createNotesPreview(token)
    createNotesView()
    createPomodoroView()

    initializeChangeView()
    renderView()
  })

  return (
    <>
    <div className="flex flex-col place-items-center text-center">
      <div className="flex place-items-center text-6xl space-x-4">
        <p id="change_view_left">‹</p>
        <div className="flex translate-y-[6px] space-x-4">
          <span id="bollino_eventi" className="border w-4 h-4 rounded-full "></span>
          <span id="bollino_attività" className="border w-4 h-4 rounded-full "></span>
          <span id="bollino_note" className="border w-4 h-4 rounded-full "></span>
          <span id="bollino_pomodoro" className="border w-4 h-4 rounded-full "></span>
        </div>
        <p id="change_view_right">›</p>
      </div>
    </div>
    <div id="view_eventi"></div>
    <div id="view_attività"></div>
    <div id="view_note"></div>
    <div id="view_pomodoro"></div>
    <div className="flex items-center text-center justify-center h-full">
      <div className="flex flex-col md:flex-row mt-10 max-h-[600px] min-h-[600px] w-full">
        <div id="events_container" style={{scrollbarWidth: "thin"}} className={`border-2 ${colors.MAIN_BORDER_LIGHT} w-full h-[600px] rounded-md p-6 md:basis-1/2 overflow-auto`}>
          <h1 className="text-3xl text-white font-bold text-center mb-6 justify-start">Eventi</h1>
          <div id="events" className="flex flex-col justify-around"></div>
        </div>
        <div id="tasks_container" style={{scrollbarWidth: "thin"}} className={`border-2 ${colors.MAIN_BORDER_LIGHT} w-full h-[600px] rounded-md p-6 md:basis-1/2 overflow-auto`}>
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
