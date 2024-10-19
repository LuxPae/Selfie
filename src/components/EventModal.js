//TODO
// - finire il form con i campi che mancano
// - opzioni di ripetizione
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getAllEvents, getEventsByRepId, createEvent, modifyEvent } from "../API/events.js";
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
  var { user, showEventModal, setShowEventModal, selectedDay, setSelectedDay, currentDate, dispatchEvent, selectedEvent, setSelectedEvent, notify, modifyRepeated } = useContext(GlobalContext)

  const [selectingBeginDate, setSelectingBeginDate] = useState(false)
  const [selectingBeginHour, setSelectingBeginHour] = useState(false)
  const [calendarType, setCalendarType] = useState("evento");
  const [selectingCalendarType, setSelectingCalendarType] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [repeated , setRepeated] = useState(false);
  const [selectingEndDate, setSelectingEndDate] = useState(false)
  const [selectingRepeatedDate, setSelectingRepeatedDate] = useState(false)
  const [isCreatingOrModifying, setIsCreatingOrModifying] = useState(false)

  const current_hour_date = (date) => {
    date = dayjs(date)
    var d;
    if (date.startOf("day").isSame(dayjs().startOf("day"))) {
      d = dayjs(date).startOf("minute");
    } else {
      d = selectedDay.add(currentDate.hour(), "hour").add(currentDate.minute(), "minute");
    }
    return d;
  }

  const event_data = () => (selectedEvent || {
    title: "",
    description: "",
    label: "white",
    allDay: false,
    begin: current_hour_date(selectedDay),
    end: current_hour_date(selectedDay).add(1, "hour"),
    repeated: false, 
    repeatedData: {
      rep_id: "",
      every: "",
      type: "",
      endsOn: selectedDay.valueOf(),
      endsAfter: 2,
    },
  })

  const [formData, setFormData] = useState(event_data())

  useEffect(() => {
    setFormData(event_data())
    setAllDay(selectedEvent?.allDay || false)
    setRepeated(selectedEvent?.repeated || false)
  }, [showEventModal, selectedEvent])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeBeginDate = (e) => {
    setSelectingBeginDate(false);
    const newFormData = {
      ...formData,
      begin: current_hour_date(e.target.value)
    }
    setFormData(newFormData)
  }
  
  const handleChangeBeginHour = (e) => {
    setSelectingBeginHour(false);
    const newFormData = {
      ...formData,
      begin: dayjs(e.target.value).startOf("minute")
    }
    setFormData(newFormData)
  }

  const handleChangeEndDate = (e) => {
    setSelectingEndDate(false);
    const newFormData = {
      ...formData,
      end: dayjs(e.target.value).startOf("minute")
    }
    setFormData(newFormData)
  }

  const handleChangeAllDay = () => {
    const new_value = !allDay
    setAllDay(new_value);
    const newFormData = {
      ...formData,
      allDay: new_value
    }
    setFormData(newFormData)
  }

  const handleChangeRepeated = () => {
    const new_value = !repeated
    setRepeated(new_value);
    const newFormData = {
      ...formData,
      repeated: new_value
    }
    setFormData(newFormData)
  }

  const handleChangeTime = (e) => {
    console.log(e.target.name, e.target.value)
    const [ hour, minute ] = e.target.value.split(':')
    const current_date = e.target.name === "begin" ? formData.begin : formData.end;
    const new_date = dayjs({ year: current_date.year(), month: current_date.month(), day: current_date.date(), hour, minute });
    console.log("current_date", current_date);
    console.log("new_date", new_date);
    const newFormData = { ...formData };
    if (e.target.name === "begin") newFormData.begin = new_date;
    else newFormData.end = new_date;
    const duration = Math.floor((dayjs(newFormData.end).subtract(dayjs(newFormData.begin))).valueOf() / (1000*60*60));
    console.log(duration);
    if (duration < 0) {
      notify("error", "L'ora di fine deve essere successiva all'ora di inizio")
    } else {
      setFormData(newFormData);
      console.log(newFormData);
    }
    setSelectingBeginHour(false);
  }

  const handleChangeRepeatedEvery = (e) => {
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        every: e.target.value
      }
    }
    setFormData(newFormData)
  }

  const handleChangeRepetitionOption = (e) => {
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        type: e.target.value
      }
    }
    setFormData(newFormData)
  }

  const handleChangeRepetitionEndsOn = (e) => {
    console.log(e.target.value)
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn: dayjs(e.target.value).valueOf()
      }
    }
    setFormData(newFormData)
    setSelectingRepeatedDate(false);
    console.log(formData)
  }

  const handleChangeRepetitionEndsAfter = (e) => {
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsAfter: parseInt(e.target.value)
      }
    }
    setFormData(newFormData)
  }

  const handleChangeLabel = (new_label) => {
    setFormData({
      ...formData,
      label: new_label.split("-")[1],
    })
  }

  const handleChangeCalendarType = (e) => {
    setCalendarType(e.target.value);
    setSelectingCalendarType(false);
  }

  const MAX_RAND_CHARS = 16
  const generate_id = (data) => {
    const rand_chars1 = Math.random().toString(36);
    const rand_chars2 = Math.random().toString(36);
    const id = (rand_chars1 + rand_chars2.substr(2)).substr(2, MAX_RAND_CHARS);
    return id;
  }

  function closeModal() {
    setShowEventModal(false);
    setSelectedEvent(null)
    //setSelectedDay(dayjs());
  }

  const handleSubmit = async (e) => {
    setIsCreatingOrModifying(true);
    if (!formData.title) {
      let tipo = (selectedEvent ? "modifica" : "creazione")+" "+ calendarType;
      notify("error", tipo+" - inserisci il titolo");
      return;
    }
    // if (!validateForm(formData)) {
    //   notify("error", "...")
    //   return; TODO
    // }
    e.preventDefault();
  
    //console.log(calendarType)
    if (calendarType === "evento") {
      var event = {
        ...formData,
        users: [user._id],
        begin: formData.begin.valueOf(),
        end: formData.end.valueOf(),
        repeatedData: {
          ...formData.repeatedData,
          rep_id: generate_id(formData.repeatedData)
        }
      };
      //console.log(event)
  
      if (selectedEvent) {
        event = {
          ...event,
          _id: selectedEvent._id,
          repeatedData: selectedEvent.repeatedData
        };
        try {
          if (modifyRepeated) {
            const modified_events = await modifyEvent(event, user, true)
            console.log("modifying "+modified_events.length+" events", modified_events)
            if (modified_events.length === 0) throw new Error("non è stato possibile modificare gli eventi")
            else {
              for (let e of modified_events) dispatchEvent({ type: "MODIFY", payload: e })
              notify("Calendario", "eventi modificati")
            }
          } else {
            const modified_event = await modifyEvent(event, user)
            if (!modified_event) throw new Error("non è stato possibile modificare l'evento");
            else {
              dispatchEvent({ type: "MODIFY", payload: event });
              notify("Calendario", "evento modificato")
            }
          }
        } catch(error) {
          console.error('Error modifying event:', error.message);
          notify("error", error.message);
        }
      }
      else {
        try {
          const created_events = await createEvent(event, user)
          if (!created_events) throw new Error("non è stato possibile creare lo/gli evento/i")
          else {
            for (let e of created_events) dispatchEvent({ type: "CREATE", payload: e });
            const finale = created_events.length === 1 ? "o" : "i"
            notify("Calendario", `event${finale} creat${finale}`)
          }
        } catch(error) {
          console.error('Error creating event:', error.message);
          notify("error", error.message);
        }
      }
    } else {
      alert("TODO: attività")
    }
    //TODO non è molto bello che si chiuda all'improvviso quando ha finito, ma sì dai
    closeModal();
    setIsCreatingOrModifying(false);
  }

  useEffect(() => {
    getAllEvents(user)
      .then(events => dispatchEvent({ type: "ALL", payload: events }))
      .catch(error => console.error(error.message))
    console.log("getting all events")
  }, [handleSubmit])

  return (
    <div className="h-full max-w-auto flex justify-right items-right">
      {/*<div id="events_container" style={{scrollbarWidth: "thin"}} className="h-[400px] min-w-[500px] mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">*/}
      <form onSubmit={handleSubmit} className="bg-green-950 w-100 border border-green-900 rounded-xl">
        <header className="bg-green-900 px-4 py-1 pb-3 flex rounded-t-lg justify-between items-start">
          <div className="px-3"></div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex space-x-2 my-2 justify-center">
              <button type="submit" className={`text-xl px-2 py-1 bg-green-700 hover:bg-green-800 rounded ${isCreatingOrModifying ? "animate-bounce" : ""}`}>{selectedEvent ? "Modifica "+(modifyRepeated ? "ripetuti" : "") : "Crea"}</button>
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
              { selectingBeginDate ?
                <>
                <div className="flex bg-green-700 space-x-4 pr-3 rounded py-1">
                  <input type="date" name="date" value={dayjs(formData.begin).format("YYYY-MM-DD")} className="rounded px-1 bg-green-700 hover:bg-green-800 text-xl" onChange={handleChangeBeginDate}/>             
                </div>
                </>
                :
                <span className="text-xl bg-green-700 rounded hover:bg-green-800 px-2 py-1 hover:cursor-pointer" onClick={() => setSelectingBeginDate(true)}>{dayjs(formData.begin).format("dddd D MMMM YYYY")}</span>
              }
            </div>
          </div>

          <button onClick={closeModal}>
            <span className="material-icons-outlined text-white rounded w-4 mt-2" tabIndex="0">
              close
            </span>
          </button>
        </header>
        <div style={{scrollbarWidth: "thin"}} className="flex flex-col items-center max-w-full min-w-[450px] p-3 max-h-[500px] overflow-auto">
          <input className="rounded my-3 text-xl font-semibold p-3 text-center placeholder:text-white bg-green-700 focus:bg-green-800" type="textarea" name="title" placeholder="Titolo" value={formData.title} onChange={handleChange} maxLength="50" required />
          <div className="mb-4 mt-2 text-white flex items-center justify-center">
            <span onClick={handleChangeAllDay} tabIndex="0" onKeyPress={(e) => { if (e.key === ' ') handleChangeAllDay() }}
                  className={`border rounded  hover:cursor-pointer px-2 py-1 hover:bg-green-800 ${allDay ? "border-transparent bg-green-700" : "hover:border-transparent"}`}
            >
              Tutto il giorno
            </span>
          </div>
          { !allDay && <div className="flex flex-col items-center">
            <span>Inizia alle</span>
            { selectingBeginHour ? 
              <input className="mb-4 mt-2 px-2 py-1 bg-green-700 hover:bg-green-800 rounded" 
                   type="time" step="900" min="06:00" max="23:00" name="begin" value={dayjs(formData.begin).format("HH:mm")} onChange={handleChangeTime}
              />
              :
              <div className="rounded mb-4 mt-2 px-2 py-1 bg-green-700 hover:bg-green-800 hover:cursor-pointer" onClick={() => setSelectingBeginHour(true)}>{dayjs(formData.begin).format("HH:mm")}</div>
            }
            <span>Finisce</span>
            <div className="flex flex-col items-center justify-content-center justify-center">
              { selectingEndDate ?
                <>
                <input type="datetime-local" name="date" value={dayjs(formData.end).format("YYYY-MM-DDTHH:mm")} className="my-2 py-1 px-2 rounded bg-green-700 hover:bg-green-800"
                       onChange={handleChangeEndDate} 
                />             
                </>
                :
                <span className="bg-green-700 rounded hover:bg-green-800 my-2 px-2 py-1 hover:cursor-pointer" onClick={() => setSelectingEndDate(true)}>
                  {dayjs(formData.end).startOf("day").isSame(dayjs(formData.begin).startOf("day")) ? "Lo stesso giorno" : dayjs(formData.end).format("dddd D MMMM YYYY")}
                  &nbsp;alle&nbsp;
                  {dayjs(formData.end).format("HH:mm")}
                </span>
              }
            </div>
          </div>}
          { (selectedEvent && selectedEvent.repeated) ? 
            <>
            <p className="my-4 p-2 max-w-[300px] border border-red-500 text-center">Non puoi modificare le opzioni di ripetizione per un evento ripetuto, piuttosto eliminalo e ricrealo.</p>
            </>
            :
            <>
            <div className="mb-4 mt-2 text-white flex items-center justify-center">
              <span onClick={handleChangeRepeated} tabIndex="0" onKeyPress={(e) => { if (e.key === ' ') handleChangeRepeated() }}
                    className={`border rounded  hover:cursor-pointer p-1 hover:bg-green-800 ${repeated ? "border-transparent bg-green-700" : "hover:border-transparent"}`}
              >
                Si ripete
              </span>
            </div>
            { repeated && <div className="flex-col flex items-center justify-center justify-content-center">
              <div className="flex flex-col space-x-4 items-center">
                <span className="">Ogni</span>
                <select className="p-1 mt-2 rounded mb-4 bg-green-700 hover:bg-green-800" defaultValue={formData.repeatedData.every} onChange={handleChangeRepeatedEvery} required>
                  <option value="">-----</option>
                  <option value="day">giorno</option>
                  <option value="week">settimana, di {dayjs(formData.date).format("dddd")}</option>
                  <option value="month">mese, il giorno {dayjs(formData.date).format("D")}</option>
                  <option value="year">anno</option>
                </select>
              </div>
              <div className="mb-8 flex items-center">
                <fieldset className="flex flex-col items-center">
                  <div className="flex space-x-4 items-center">
                    <legend className="mb-2">Finisce</legend>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex ml-4 mb-2">
                      <input type="radio" value="endsOn" name="repeated_type" onChange={handleChangeRepetitionOption} checked={formData.repeatedData.type === "endsOn"}/>
                      { selectingRepeatedDate ?
                        <>
                        <div className="ml-2 p-1 flex justify-between bg-green-700 rounded">
                          <label className="">il</label>
                          <input type="date" name="date" value={dayjs(formData.repeatedData.endsOn).format("YYYY-MM-DD")} className="ml-2 rounded bg-green-700 hover:bg-green-800"
                                 onChange={handleChangeRepetitionEndsOn} 
                          />             
                        </div>
                        </>
                        :
                        <span className="bg-green-700 rounded ml-2 hover:bg-green-800 px-2 p-1 hover:cursor-pointer"
                              onClick={() => setSelectingRepeatedDate(true)}>{dayjs(formData.repeatedData.endsOn).format("dddd D MMMM YYYY") || dayjs(formData.date).format("dddd D MMMM YYYY")}
                        </span>
                      }
                    </div>
                    <div className="ml-4">
                      <input type="radio" value="endsAfter" name="repeated_type" onChange={handleChangeRepetitionOption} checked={formData.repeatedData.type === "endsAfter"}/>
                      <label className="ml-2">dopo</label>
                      <input type="number" className="max-w-[45px] bg-green-700 hover:bg-green-800 pl-1 mt-2 rounded mx-3" value={formData.repeatedData.endsAfter || 2} onChange={handleChangeRepetitionEndsAfter} min="2" max="365"/>
                      <span>occorrenze</span>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>}
          </>}
          <textarea style={{scrollbarWidth: "thin"}} className="rounded p-2 my-3 mb-4 min-w-[400px] min-h-[90px] text-center placeholder:text-white bg-green-700 focus:bg-green-800" name="description" placeholder="Descrizione" value={formData.description} onChange={handleChange} />
          <div className="flex items-center justify-center gap-x-2">
            {labelsClasses.map((label, i) => (
              <span key={i}
                onClick={() => handleChangeLabel(label)}
                tabIndex="0"
                onKeyPress={(e) => { if (e.key === ' ') handleChangeLabel(label) }}
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
