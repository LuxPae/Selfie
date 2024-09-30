//TODO
// - finire il form con i campi che mancano
// - opzioni di ripetizione
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { createEvent, deleteEvent, modifyEvent } from "../API/events.js";
import {v4 as uuidv4} from "uuid"
import dayjs from "dayjs"

const labelsClasses = [
  "bg-white",
  "bg-red-600",
  "bg-orange-500",
  "bg-yellow-400",
   "bg-green-500",
  "bg-cyan-400",
  "bg-blue-600"
]

export default function EventModal() {
  const { user, setShowEventModal, selectedDay, setSelectedDay, dispatchEvent, selectedEvent, setSelectedEvent } = useContext(GlobalContext)

  const [selectingDate, setSelectingDate] = useState(false)
  const [allDay, setAllDay] = useState(false);
  const [repeated , setRepeated] = useState(false);

  const event_data = () => (selectedEvent || {
    title: "",
    description: "",
    label: "white",
    date: selectedDay,
    allDay: false,
    begin: dayjs(),
    end: dayjs().add(1, "hour"),
    repeated: false 
  })

  const [formData, setFormData] = useState(event_data())

  useEffect(() => {
    setFormData(event_data())
  }, [selectedEvent])
  
  const handleChange = (e) => {
    console.log(e.target.value)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleDateChange = (e) => {
    setSelectingDate(false);
    setFormData({
      ...formData,
      date: dayjs(e.target.value)
    })
  }

  const handleChangeAllDay = (e) => {
    const value = e.target.checked;
    setFormData({
      ...formData,
      allDay: value
    })
    setAllDay(value);
    console.log(formData)
  }

  const handleChangeTime = (e) => {
    console.log(e.target.value);
    const [hour, min] = e.target.value.split(':')
    const date = dayjs(formData.date)
    const time = date.add(hour-date.hour(), "hour").add(min-date.minute(), "minute");
    console.log(time)
    setFormData({
      ...formData,
      [e.target.name]: time
    })
  }

  const handleChangeCheckBox = (e) => {
    const {name, checked} = e.target;
    console.log(name, checked);
    setFormData({
      ...formData,
      [e.target.name]: checked
    })
    if (name === "allDay") setAllDay(checked);
    else if (name === "repeated") setRepeated(checked);
    console.log(formData)
  }

  const handleLabelChange = (new_label) => {
    setFormData({
      ...formData,
      label: new_label.split("-")[1],
    })
  }

  async function handleSubmit(e) {
    console.log("Submitting event");
    if (!selectedEvent) console.log("Creating new event")
    else console.log("Modifying event")
    e.preventDefault();
  
    const calendarEvent = {
      _id: selectedEvent ? selectedEvent._id : uuidv4(),
      users: [user._id],
      ...formData
    };
    console.log(calendarEvent)
  
    if (selectedEvent) {
      try {
        //TODO prima o poi verrà sistemato il backend
        //await modifyEvent(selectedEvent._id, calendarEvent) // Call modifyEvent with the event ID and updated data
        dispatchEvent({ action: 'modify', event: calendarEvent }); // Assuming the API returns the updated event
      }
      catch(err) {
        console.error('Error modifying event:', err);
        // Handle error appropriately (e.g., show error message to the user)
      }
    }
    else {
      try {
        alert("Create event in DB: TODO")
        //TODO prima o poi verrà sistemato il backend
        //await createEvent(calendarEvent)
        if (!calendarEvent) throw new Error("Could not create event")
        else {
          dispatchEvent({ action: 'create', event: calendarEvent }); // Assuming the API returns the created event
        }
      }
      catch(err) {
        console.error('Error creating event:', err);
        // Handle error appropriately (e.g., show error message to the user)
      }
    }
    setSelectedEvent(null);
    setShowEventModal(false);
  }

  function handleDelete(e) {
    e.preventDefault();
    if (selectedEvent) {
      // Call the API to delete the event
      deleteEvent(selectedEvent._id)
        .then(() => {
          dispatchEvent({ action: 'delete', event: selectedEvent });
        })
        .catch(error => {
          console.error('Error deleting event:', error);
          // Handle error appropriately (e.g., show error message to the user)
        });
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  }

  function closeModal() {
    setShowEventModal(false);
    setSelectedEvent(null)
    setSelectedDay(dayjs());
  }

  return (
    <div className="h-full w-auto flex justify-right items-right">
      <form className="bg-green-950 w-100 rounded-lg">
        <header className="bg-green-900 px-4 py-2 flex rounded-t-lg justify-between items-center">
          {/* TODO: okay quindi devo mettere il selected day come value dell'input e la scritta come span prima? forse funziona */}
          <div className="flex">
            <span className="text-xl mr-2">{selectedEvent ? "Modifica" : "Crea"} evento</span>
            { selectingDate ?
              <>
              <input type="date" name="date" value={formData.date} className="border mr-2 px-1 bg-green-900 text-xl" onChange={handleDateChange}/>             
              <span className="hover:cursor-pointer material-symbols-outlined rounded mt-1 w-4 h-4" onClick={() => setSelectingDate(false)} title="annulla">cancel</span>
              </>
              :
              <span className="text-xl hover:cursor-pointer" onClick={() => setSelectingDate(true)}>{dayjs(formData.date).format("dddd D MMMM YYYY")}</span>
            }
            </div>

            <div>
          </div>
          <button onClick={closeModal}>
            <span className="material-icons-outlined text-white rounded w-4" tabIndex="0">
              close
            </span>
          </button>
        </header>
        <div className="p-3">
          <input className="mb-4 pl-2 pt-3 border-0 text-white text-xl font-semibold pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" type="text" name="title" placeholder="Titolo" value={formData.title} onChange={handleChange} required />
          <div className="mb-6 mt-2 pl-2 text-white flex items-center">
            <span className="mr-2">Tutto il giorno:</span>
            <input className="w-4 h-4 accent-green-600" type="checkbox" name="allDay" checked={allDay} onChange={handleChangeCheckBox}/>
          </div>
          { !allDay && <div>
            <input className="mb-4 pl-2 pt-3 border-0 text-white pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" type="time" name="begin" value={dayjs(formData.begin).format("HH:mm")} onChange={handleChangeTime} />
            <input className="mb-4 pl-2 pt-3 border-0 text-white pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" type="time" name="end" value={dayjs(formData.end).format("HH:mm")} onChange={handleChangeTime} />
          </div>}
          <div className="mb-2 mt-2 pl-2 text-white flex items-center">
            <span className="mr-2">Ripetuto:</span>
            <input className="w-4 h-4 accent-green-600" type="checkbox" name="repeated" checked={repeated} onChange={handleChangeCheckBox}/>
          </div>
          { repeated && <div className="ml-8">
            <div>
              <span className="mr-4">Ogni</span>
              <select className="mb-4 bg-green-800">
                <option value="">-----</option>
                <option value="dog">giorno</option>
                <option value="cat">settimana, di {formData.date.format("dddd")}</option>
                <option value="hamster">mese, il giorno {formData.date.format("D")}</option>
                <option value="hamster">anno</option>
              </select>
            </div>
            <div className="mb-8">
              <span className="mr-4">Finisce il</span>
              <p>TODO con una checkbox: giorno o dopo n occorrenze</p>
              <input className="bg-green-800" type="date"/>
            </div>
          </div>}
          <textarea className="mb-4 pl-2 pt-3 border-0 text-white pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" name="description" placeholder="Descrizione" value={formData.description} onChange={handleChange} />
          <div className="flex gap-x-2">
            {labelsClasses.map((label, i) => (
              <span key={i}
                onClick={() => handleLabelChange(label)}
                className={`${label} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}>
                {formData.label === label.split('-')[1] &&
                  <span className={`material-icons-outlined text-black text-base`}>check</span>
                }

              </span>
            ))}
          </div>
        </div>
        <div>
          <footer className="flex justify-end w-100 border-t p-3 mt-5">
            <button type="submit" 
              onClick={handleSubmit}
              className="bg-green-700 hover:bg-green-800 px-6 py-2 rounded text-white">Salva
            </button>
          </footer>
        </div>
      </form>
    </div>
)
}
