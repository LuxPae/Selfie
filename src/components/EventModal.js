//TODO
// - finire il form con i campi che mancano
// - opzioni di ripetizione
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { createEvent, modifyEvent } from "../API/events.js";
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
  var { user, setShowEventModal, selectedDay, setSelectedDay, dispatchEvent, selectedEvent, setSelectedEvent, notify } = useContext(GlobalContext)

  const [selectingDate, setSelectingDate] = useState(false)
  const [calendarType, setCalendarType] = useState("evento");
  const [selectingCalendarType, setSelectingCalendarType] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [repeated , setRepeated] = useState(false);
  const [repeatedData, setRepeatedData] = useState(selectedEvent?.repeatedData || {
    every: "",
    type: "endsOn",
    endsOn: null,
    endsAfter: null,
  })

  const event_data = () => (selectedEvent || {
    title: "",
    description: "",
    label: "white",
    date: selectedDay,
    allDay: false,
    begin: dayjs(),
    end: dayjs().add(1, "hour"),
    duration: 1,
    repeated: false, 
    repeatedData: {
      every: "",
      type: "endsOn",
      endsOn: null,
      endsAfter: null,
    },
  })

  const [formData, setFormData] = useState(event_data())

  useEffect(() => {
    setFormData(event_data())
    setAllDay(selectedEvent?.allDay)
    setRepeated(selectedEvent?.repeated)
  }, [selectedEvent])

  const handleChange = (e) => {
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

  const handleChangeAllDay = () => {
    setAllDay(!allDay);
    const newFormData = {
      ...formData,
      allDay
    }
    setFormData(newFormData)
  }

  const handleChangeRepeated = () => {
    setRepeated(!repeated);
    const newFormData = {
      ...formData,
      repeated
    }
    setFormData(newFormData)
  }

  const handleChangeTime = (e) => {
    const [ hour, minute ] = e.target.value.split(':')
    const event_date = dayjs(formData.date)
    const time = dayjs({ hour, minute });
    console.log(time);
    const newFormData = { ...formData, [e.target.name]: time.valueOf() };
    const duration = Math.floor((dayjs(newFormData.end).subtract(dayjs(newFormData.begin))).valueOf() / (1000*60*60));
    console.log(duration);
    if (duration < 0) {
      notify("error", "L'ora di fine deve essere successiva all'ora di inizio")
    } else {
      newFormData.duration = duration;
      setFormData(newFormData);
      console.log(newFormData);
    }
  }

  const handleChangeRepeatedEvery = (e) => {
    setRepeatedData({
      ...repeatedData,
      every: e.target.value
    })
  }

  const handleChangeRepetitionOption = (e) => {
    setRepeatedData({
      ...repeatedData,
      type: e.target.value
    })
    console.log(repeatedData)
  }

  const handleChangeRepetitionEndsOn = (e) => {
    setRepeatedData({
      ...repeatedData,
      endsOn: dayjs(e.target.value)
    })
  }

  const handleChangeRepetitionEndsAfter = (e) => {
    setRepeatedData({
      ...repeatedData,
      endsAfter: e.target.value
    })
  }

  const handleLabelChange = (new_label) => {
    setFormData({
      ...formData,
      label: new_label.split("-")[1],
    })
  }

  const handleChangeCalendarType = (e) => {
    setCalendarType(e.target.value);
    setSelectingCalendarType(false);
  }

  const handleSubmit = async (e) => {
    if (!formData.title) {
      let tipo = (selectedEvent ? "modifica" : "creazione")+" "+ calendarType;
      notify("error", tipo+" - inserisci il titolo");
      return;
    }
    // if (!validateEvent(formData)) return; TODO
    e.preventDefault();
  
    console.log(calendarType)
    if (calendarType === "evento") {
      var event = {
        ...formData,
        users: [user._id],
        date: dayjs(formData.date).startOf("day").valueOf(),
        begin: formData.begin.valueOf(),
        end: formData.end.valueOf()
      };
      //console.log(event)
  
      if (selectedEvent) {
        event = { ...event, _id: selectedEvent._id };
        try {
          const modified_event = await modifyEvent(event, user)
          if (!modified_event) throw new Error("non è stato possibile modificare l'evento");
          else {
            dispatchEvent({ type: "MODIFY", payload: event });
            notify("Calendario", "evento modificato")
          }
        } catch(error) {
          console.error('Error modifying event:', error.message);
          notify("error", error.message);
        }
      }
      else {
        try {
          const new_event = await createEvent(event, user)
          if (!new_event) throw new Error("non è stato possibile creare l'evento")
          else {
            dispatchEvent({ type: "CREATE", payload: event });
            notify("Calendario", "evento creato")
          }
        } catch(error) {
          console.error('Error creating event:', error.message);
          notify("error", error.message);
        }
      }
    } else {
      alert("TODO: attività")
    }
    setSelectedEvent(null);
    setShowEventModal(false);
  }

  function closeModal() {
    setShowEventModal(false);
    setSelectedEvent(null)
    setSelectedDay(dayjs());
  }

  return (
    <div className="h-full max-w-auto flex justify-right items-right">
      {/*<div id="events_container" style={{scrollbarWidth: "thin"}} className="h-[400px] min-w-[500px] mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">*/}
      <form onSubmit={handleSubmit} className="bg-green-950 w-100 border border-green-900 rounded-xl">
        <header className="bg-green-900 px-4 py-2 flex rounded-t-lg justify-between items-start">
          <div className="px-3"></div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex space-x-2 my-2 justify-center">
              <button type="submit" className="text-xl px-2 py-1 bg-green-700 hover:bg-green-800 rounded">{selectedEvent ? "Modifica" : "Crea"}</button>
              { selectingCalendarType ?
                <select className="text-xl bg-green-700 hover:bg-green-800 rounded px-2 max-w-30" onChange={handleChangeCalendarType}>
                  <option value="">scegli</option>
                  <option value="evento">evento</option>
                  <option value="attività">attività</option>
                </select>
                :
                <span className="items-center flex text-xl hover:cursor-pointer bg-green-700 hover:bg-green-800 min-w-[40px] px-[18px] rounded" onClick={() => setSelectingCalendarType(true)}>{calendarType}</span>
              }
            </div>
            <div className="flex space-x-2">
              { selectingDate ?
                <>
                <div className="flex bg-green-700 space-x-4 pr-3 rounded py-1">
                  <input type="date" name="date" value={dayjs(formData.date).format("YYYY-MM-DD")} className="ml-2 rounded px-1 bg-green-700 hover:bg-green-800 text-xl" onChange={handleDateChange}/>             
                  <span className="hover:cursor-pointer material-symbols-outlined rounded mt-1 items-center w-4 h-4" onClick={() => setSelectingDate(false)} title="annulla">cancel</span>
                </div>
                </>
                :
                <span className="text-xl bg-green-700 rounded hover:bg-green-800 px-2 py-1 hover:cursor-pointer" onClick={() => setSelectingDate(true)}>{dayjs(formData.date).format("dddd D MMMM YYYY")}</span>
              }
            </div>
          </div>

          <button onClick={closeModal}>
            <span className="material-icons-outlined text-white rounded w-4" tabIndex="0">
              close
            </span>
          </button>
        </header>
        <div style={{scrollbarWidth: "thin"}} className="max-w-full min-w-[400px] p-3 max-h-[550px] overflow-auto">
          <input className="mb-4 pt-3 border-0 text-white text-xl font-semibold pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500 text-center" type="text" name="title" placeholder="Titolo" value={formData.title} onChange={handleChange} required />
          <div className="mb-4 mt-2 text-white flex items-center justify-center">
            <span onClick={handleChangeAllDay} tabIndex="0" onKeyPress={(e) => { if (e.key === ' ') handleChangeAllDay() }}
                  className={`border rounded  hover:cursor-pointer p-1 ${allDay ? "border-transparent bg-green-700" : "hover:border-transparent hover:bg-green-800"}`}
            >
              Tutto il giorno
            </span>
          </div>
          { !allDay && <div>
            <span className="mr-2">Inizio</span>
            <input className="mb-4 pl-2 pt-3 border-0 text-white pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" 
                   type="time" step="900" name="begin" value={dayjs(formData.begin).format("HH:mm")} onChange={handleChangeTime} />
            <span className="mr-2">Fine</span>
            <input className="mb-4 pl-2 pt-3 border-0 text-white pb-2 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500"
                   type="time" step="900" name="end" value={dayjs(formData.end).format("HH:mm")} onChange={handleChangeTime} />
          </div>}
          <div className="mb-4 mt-2 text-white flex items-center justify-center">
            <span onClick={handleChangeRepeated} tabIndex="0" onKeyPress={(e) => { if (e.key === ' ') handleChangeRepeated() }}
                  className={`border rounded  hover:cursor-pointer p-1 ${repeated ? "border-transparent bg-green-700" : "hover:border-transparent hover:bg-green-800"}`}
            >
              Si ripete
            </span>
          </div>
          { repeated && <div className="flex-col flex items-center justify-center justify-content-center">
            <div className="flex flex-col space-x-4 items-center">
              <span className="">Ogni</span>
              <select className="mb-4 bg-green-800" onChange={handleChangeRepeatedEvery}>
                <option value={repeatedData.every || "mai"}>-----</option>
                <option value="day">giorno</option>
                <option value="week">settimana, di {dayjs(formData.date).format("dddd")}</option>
                <option value="month">mese, il giorno {dayjs(formData.date).format("D")}</option>
                <option value="year">anno</option>
              </select>
            </div>
            <div className="mb-8">
              <fieldset>
                <legend className="mb-2">Finisce</legend>
                  <div className="ml-4 mb-2">
                    <input type="radio" value="endsOn" name="repeated_type" onChange={handleChangeRepetitionOption}/>
                    <label className="ml-2">il</label>
                    <input type="date" className="bg-green-800 ml-3" value={(repeatedData.endsOn || dayjs()).format("YYYY-MM-DD")} onChange={handleChangeRepetitionEndsOn}/>
                  </div>
                  <div className="ml-4">
                    <input type="radio" value="endsAfter" name="repeated_type" onChange={handleChangeRepetitionOption}/>
                    <label className="ml-2">dopo</label>
                    <input type="number" className="max-w-[45px] bg-green-800 pl-1 mx-3" value={repeatedData.endsAfter || 1} onChange={handleChangeRepetitionEndsAfter} min="1"/>
                    <span>occorrenz{repeatedData.endsAfter > 1 ? 'e' : 'a'}</span>
                  </div>
              </fieldset>
            </div>
          </div>}
          <textarea className="mb-4 text-center pt-3 border-0 text-white pb-1 w-full border-b-2 border-green-900 focus:outline-none focus:ring-0 focus:border-green-500" name="description" placeholder="Descrizione" value={formData.description} onChange={handleChange} />
          <div className="flex items-center justify-center gap-x-2">
            {labelsClasses.map((label, i) => (
              <span key={i}
                onClick={() => handleLabelChange(label)}
                tabIndex="0"
                onKeyPress={(e) => { if (e.key === ' ') handleLabelChange(label) }}
                className={`${label} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}>
                {formData.label === label.split('-')[1] &&
                  <span className={`material-icons-outlined text-black text-base`}>check</span>
                }

              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
)
}
