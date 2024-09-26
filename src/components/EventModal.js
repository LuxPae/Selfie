import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { createEvent, deleteEvent, modifyEvent } from "../API/events.js";
import {v4 as uuidv4} from "uuid"
import dayjs from "dayjs"

const labelsClasses = [
  "bg-red-600",
  "bg-orange-500",
  "bg-yellow-400",
   "bg-green-500",
  "bg-cyan-400",
  "bg-blue-600"
]

export default function EventModal() {
    const { setShowEventModal, selectedDay, setSelectedDay, dispatchCalEvent, setSelectedEvent, selectedEvent } = useContext(GlobalContext)

    const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : [])
    const [description, setDescription] = useState(selectedEvent ? selectedEvent.description : [])
    const [selectedLabel, setSelectedLabel] = useState(selectedEvent ? labelsClasses.find((lbl) => lbl === selectedEvent.label) : labelsClasses[0]) 
    
    useEffect(() => {
        setTitle(selectedEvent ? selectedEvent.title : "");
        setDescription(selectedEvent ? selectedEvent.description : "");
        setSelectedLabel(selectedEvent ? labelsClasses.find(label => label === selectedEvent.label) : "white");
    }, [selectedEvent]);


async function handleSubmit(e) {
    e.preventDefault();

    const calendarEvent = {
        _id: selectedEvent ? selectedEvent._id : uuidv4(),
        title,
        description,
        label: selectedLabel.split("-")[1],
        due_date: selectedDay.valueOf()
    };

    if (selectedEvent) {
      console.log("Event ID on Update:", selectedEvent._id);
      try {
        let modified_event = await modifyEvent(selectedEvent._id, calendarEvent) // Call modifyEvent with the event ID and updated data
        dispatchCalEvent({ action: 'modify', event_to_dispatch: modified_event }); // Assuming the API returns the updated event
        setShowEventModal(false);
      }
      catch(err) {
        console.error('Error modifying event:', err);
        // Handle error appropriately (e.g., show error message to the user)
      }
    }
    else {
      // Call the API to create the event
      try {
        console.log("Creating Event:", calendarEvent);
        const new_event = await createEvent(calendarEvent)
        if (!new_event) throw new Error("Could not create event")
        else {
          console.log("new event", new_event);
          dispatchCalEvent({ action: 'create', event_to_dispatch: new_event }); // Assuming the API returns the created event
        }
        setShowEventModal(false);
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
                dispatchCalEvent({ action: 'delete', event_to_dispatch: selectedEvent });
                setSelectedEvent(null);  // Ensure this is called to reset selectedEvent
                setShowEventModal(false);
            })
            .catch(error => {
                console.error('Error deleting event:', error);
                setShowEventModal(false);
                // Handle error appropriately (e.g., show error message to the user)
            });
    }
}

  function closeModal() {
    setShowEventModal(false);
    setSelectedDay(dayjs());
  }

    return (
        <div className="h-full w-auto flex justify-right items-right">
          <form className="bg-green-950 rounded-lg w-100">
            <header className="bg-green-900 px-4 py-2 flex justify-between items-center">
              <p className="text-xl">Crea un evento <span className="underline">{selectedDay.format("dddd D MMMM YYYY")}</span></p>
              <div>
              {selectedEvent && (
                <span onClick={handleDelete} className="material-icons-outlined text-white cursor-pointer">
                  delete
                </span>
              )}
              </div>
              <button onClick={closeModal}>
                <span className="material-icons-outlined text-white" tabIndex="0">
                  close
                </span>
              </button>
            </header>
            <div className="p-3">
              <div className="grid grid-cols-1/5 items-end gap-y-7">
                <div>
                  <input className="pl-2 pt-3 border-0 text-white text-xl font-semibold pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" type="text" name="title" placeholder="Titolo Evento" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <span className="material-icons-outlined text-white">schedule</span>
                  <input className="pl-2 pt-3 border-0 text-white pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" type="text" name="description" placeholder="Descrizione Evento" value={description} onChange={(e) => setDescription(e.target.value)} />

                  <span className="material-icons-outlined text-white">
                    bookmark_border
                  </span>
                  <div className="flex gap-x-2">
                    {labelsClasses.map((label, i) => (
                      <span key={i}
                        onClick={() => setSelectedLabel(label)}
                        className={`${label} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}>
                        {selectedLabel === label &&
                          <span className={`material-icons-outlined text-black text-base`}>check</span>
                        }

                      </span>
                    ))}
                  </div>
                  </div>
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
