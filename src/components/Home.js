// [TODO]
// - tiny scrollbars for notes and events
// - usare il localStorage per mandare informazioni da qui ad altre parti
import * as colors from "../scripts/COLORS.js"
import { useEffect } from "react"
import { getAllEvents } from "../API/events.js"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const HomeVanilla = () => {

  const navigate = useNavigate();
  var user = null;
  var events = [];
  var error = "";

  const goToInitialPage = () => {
    navigate("/")
  }
  const goToCalendar = () => {
    navigate("/calendar")
  }
  const goToNote = () => {
    navigate("/notes")
  }
  
  const fetchProfile = () => user = JSON.parse(localStorage.getItem("user"));
  const fetchEvents = () => {
    getAllEvents(user)
      .then(fetchedEvents => {
        events = fetchedEvents
        createEventsPreview();
      })
      .catch(error => {
        console.error(error.message);
        error = error.message;
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
  ];
  
  const max_chars = 100;
  const TruncateLongText = (text) => text.length <= max_chars ? text : text.slice(0, max_chars)+"...";
  
  const max_notes = 3;
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
    <p class="text-left mx-5 mt-2 text-gray-200">${TruncateLongText(note.content)}</p>
  </div>`)
  }
  
  const EventTemplate = (event) => {
    return (
  `<div id="event_${event._id}" class="bg-gradient-to-l ${colors.MAIN_BORDER_DARK} border ${colors.HOME_GRADIENT_1} ${colors.HOME_GRADIENT_2} hover:bg-gradient-to-r p-6 rounded-lg mb-6 hover:animate-pulse">
    <h2 class="text-2xl font-semibold mb-2">${event.title}</h2>
    <p class="text-gray-300 mb-4">${event.description}</p>
    
    <div class="text-sm text-gray-400">
      <p><strong>Creato </strong> ${dateFormat(event.createAt)}</p>
      <p><strong>Modificato </strong> ${dateFormat(event.updateAt)}</p>
      <p><strong>Ripetuto:</strong> ${event.repeated ? "Sì" : "No"}</p>
    </div>
  </div>`
    )
  }
  
  const dateFormat = (date) => dayjs(date).format("dddd DD MMMM YYYY")+" alle "+dayjs(date).format("HH:mm")
  
  const createNotesPreview = () => {
    let notes = document.getElementById("notes");
    notes.replaceChildren();
    let i = 0;
    while (i < max_notes && i < note_prova.length) {
      notes.innerHTML += NoteTemplate(note_prova[i]);
      i++
    }
  
    for (let note of note_prova) {
      let note_node = document.getElementById(`note_${note.id}`);
      if (note_node) note_node.addEventListener("click", () => goToNote());
    }
  }
  
  const createEventsPreview = () => {
    let events_div = document.getElementById("events");
    events_div.replaceChildren();
    if (!events) {
      events_div.innerHTML = "<p>Non hai eventi per i prossimi giorni</p>"
      return;
    }
    for (let event of events) {
      events_div.innerHTML += EventTemplate(event);
    }
  
    for (let event of events) {
      let event_node = document.getElementById(`event_${event._id}`);
      if (event_node) event_node.addEventListener("click", () => goToCalendar());
    }
  }
  
  const setUserInfo = () => {
    fetchProfile();
    if (!user) goToInitialPage();
  
    fetchEvents();
    createNotesPreview();
  };

  useEffect(() => {
    setUserInfo();
  }, []);

  return (
    <>
    <div className="flex items-center text-center justify-center h-full">
      <div className="flex mt-10">
        <div id="notes_container" className={`border-2 ${colors.MAIN_BORDER_LIGHT} rounded-md text-white p-6 basis-1/2 m-2`}>
          <h1 className="text-3xl font-bold text-center mb-6">Le mie note</h1>
          <div id="notes"></div>
        </div>
        <div id="events_container" className={`border-2 ${colors.MAIN_BORDER_LIGHT} rounded-md text-white p-6 basis-1/2 m-2`}>
          <h1 className="text-3xl font-bold text-center mb-6">Eventi prossimi</h1>
          <div id="events"></div>
      </div>
    </div>
  </div>
    </>
  );
}

export default HomeVanilla;
