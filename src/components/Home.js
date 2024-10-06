// TODO
// - tiny scrollbars for notes and events

import { useEffect } from "react"
import axios from "axios"
import dayjs from "dayjs"

var user = null;

const goToInitialPage = () => { user = null; window.location.href = "/" }
const goToNote = (title) => { return () => { user = null; window.location.href = `/notes/${encodeURI(title)}` } };
const goToCalendar = () => { return () => { user = null; window.location.href = "/calendar" } };

const fetchProfile = () => user = JSON.parse(localStorage.getItem("user"));

const note_prova = [
  {
    id: 1,
    title:"Nota di Prova",
    content:"Ciao sono una nota di prova :)",
    date_of_creation: new Date(2024, 5, 27),
    last_modified: new Date(2024, 5, 27),
  },
  {
    id: 2,
    title:"La nota lunga", 
    content:"Anche io sono una nota di prova, ma decisamente più lunga, ciao Riccardo è molto divertente fare il museo con te, eccoci qui, pronti, PEFFOZZA.", 
    date_of_creation: new Date(2024, 5, 27),
    last_modified: new Date(2024, 5, 27),
  },
  {
    id: 3, 
    title:"Nota corta 1", 
    content:"Nota corta 1", 
    date_of_creation: new Date(2024, 5, 27),
    last_modified: new Date(2024, 5, 27),
  },
  {
    id: 4,
    title:"Nota corta 2", 
    content:"Nota corta 2",
    date_of_creation: new Date(2024, 5, 27),
    last_modified: new Date(2024, 5, 27),
  }
];

const max_chars = 100;
const TruncateLongText = (text) => text.length <= max_chars ? text : text.slice(0, max_chars)+"...";

const FormatDateYYYYDDMM = (date) => {
  let date_string = date.toISOString();
  return date_string.slice(0, date_string.indexOf('T'));
}

const FormatDateReadable = (date) => {
  return date.toLocaleString("it", { timeZone: "UTC", minimumIntegerDigits: 2})
}

const max_notes = 3;
const Template_SingleNote = (note) => {
  return (
`<div id="note_${note.id}" class="hover:animate-pulse bg-gradient-to-b hover:bg-gradient-to-t from-green-900 to-gray-900 p-5 rounded-lg border border-green-900 mb-4">
  <div class="flex flex-row justify-between">
    <h2 class="text-left text-xl font-semibold mb-2">${note.title}</h2>
    <div>
      <p class="text-gray-400 text-left text-xs"><strong>Creata il:</strong> ${FormatDateReadable(note.date_of_creation)}</p>
      <p class="text-gray-400 text-left text-xs mb-2"><strong>Modificata il:</strong> ${FormatDateReadable(note.last_modified)}</p>
    </div>
  </div>
  <p class="text-left mx-5 mt-2 text-gray-200">${TruncateLongText(note.content)}</p>
</div>`)
}

const Template_SingleEvent = (event) => {
  return (
`<div id="event_${event.id}" class="bg-gradient-to-l border-green-900 border from-gray-900 to-green-900 hover:bg-gradient-to-r p-6 rounded-lg mb-6 hover:animate-pulse">
  <h2 class="text-2xl font-semibold text-white mb-2">${event.title}</h2>
  <p class="text-gray-300 mb-4">${event.desc}</p>
  
  <div class="text-sm text-gray-400">
    <p><strong>Creata il:</strong> ${FormatDateReadable(event.date_of_creation)}</p>
    <p><strong>Da fare entro il:</strong> ${FormatDateReadable(event.date_of_expiry)}</p>
  </div>
</div>`
  )
}

const createNotesPreview = () => {
  let notes = document.getElementById("notes");
  notes.replaceChildren();
  let i = 0;
  while (i < max_notes && i < note_prova.length) {
    notes.innerHTML += Template_SingleNote(note_prova[i]);
    i++
  }

  for (let note of note_prova) {
    let note_node = document.getElementById(`note_${note.id}`);
    if (note_node) note_node.addEventListener("click", goToNote(note.title));
  }
}

const eventi_prova = [
  {
    id: 1, 
    title: "Evento 1", 
    desc: "Descrizione dell'evento 1", 
    date_of_creation: dayjs(new Date(2024, 4, 27)).valueOf(), 
    date_of_expiry: dayjs(new Date(2024, 7, 15)).valueOf()
  },
  {
    id: 2, 
    title: "Evento 2", 
    desc: "Descrizione dell'evento 2", 
    date_of_creation: dayjs(new Date(2024, 5, 27)).valueOf(), 
    date_of_expiry: dayjs(new Date(2024, 6, 15)).valueOf()
  },
];

const createEventsPreview = () => {
  let events = document.getElementById("events");
  events.replaceChildren();
  for (let e of eventi_prova) {
    events.innerHTML += Template_SingleEvent(e);
  }

  for (let e of eventi_prova) {
    let event_node = document.getElementById(`event_${e.id}`);
    if (event_node) event_node.addEventListener("click", goToCalendar());
  }
}

const setUserInfo = async () => {
  fetchProfile();
  if (!user) goToInitialPage();

  createNotesPreview();
  createEventsPreview();
};

const HomeVanilla = () => {

  useEffect(() => {
    setUserInfo();
  }, []);

  return (
    <>
    <div className="flex items-center text-center justify-center h-full">
      <div className="flex mt-10">
        <div id="notes_container" className="border-2 border-gray-500 rounded-md text-gray-100 p-6 basis-1/2 m-2">
          <h1 className="text-3xl font-bold text-center mb-6">Le mie note</h1>
          <div id="notes"></div>
        </div>
        <div id="events_container" className="border-2 border-gray-500 rounded-md p-6 basis-1/2 m-2">
          <h1 className="text-3xl font-bold text-center mb-6">Eventi prossimi</h1>
          <div id="events"></div>
      </div>
    </div>
  </div>
    </>
  );
}

export default HomeVanilla;
