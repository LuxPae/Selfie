//[TODO]
// - current_hour cazzi e mazzi
// - selecting dates and hours like in the calendar main view
// - sarebbe bello che se l'evento si ripete ogni giorno puoi scegliere ogni giorno, se è ogni settimana solo 7 giorni, se è mese solo mese, se è anno solo anno
// - MODAL alternativo per le attività:
//   > titolo
//   > data (singola)
//   > ora (singola)
//   > allDay
//   > repeated + repeatedData
//   > Descrizione
//   > label
import { useContext, useEffect, useState, useMemo } from "react";
import GlobalContext from "../context/GlobalContext";
import Button from "../components/Button.js"
import { getEventsByRepId, createEvent, modifyEvent } from "../API/events.js";
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"
import { monthsNames } from "../scripts/CONSTANTS.js"

const labelsClasses = [...Object.values(colors.labelsBackground)]

export default function EventModal() {
  var { user, showEventModal, setShowEventModal, selectedDay, setSelectedDay, currentDate, allEvents_createEvents, allEvents_modifyEvents, selectedEvent, setSelectedEvent, notify, modifyRepeated } = useContext(GlobalContext)

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
    isTask: null,
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

  const [duping, setDuping] = useState(false)
  const [selectingBeginDate, setSelectingBeginDate] = useState(false)
  const [selectingBeginHour, setSelectingBeginHour] = useState(false)
  const [selectingCalendarType, setSelectingCalendarType] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [repeated, setRepeated] = useState(false);
  const [selectingEndDate, setSelectingEndDate] = useState(false)
  const [isCreatingOrModifying, setIsCreatingOrModifying] = useState(false)

  const [selectingEndsOn, setSelectingEndsOn] = useState(false)
  const [newEndsOn, setNewEndsOn ] = useState((() => {
    const endsOnDate = selectedEvent ? dayjs(selectedEvent) : dayjs(selectedDay)
    return ({ day: endsOnDate.date(), month: endsOnDate.month(), year: endsOnDate.year() })
  })())

  //TODO 
  const endsOnDayChoice = () => {
    var endsOn = dayjs({...newEndsOn})
    const begin = dayjs(formData.begin)

    if (formData.repeatedData.every === "week") {
      var dates = []
      let i = 1
      const firstDate = begin.month() === endsOn.month() ? begin : endsOn.startOf("month")
      let date = firstDate
      while (!date.isAfter(endsOn.endOf("month"))) {
        if (date.day() === begin.day()) dates.push(date)
        date = firstDate.add(i, "day")
        i++
      }
      const daysChoice = dates.map(d => d.date())
      return daysChoice
    } else {
      const daysInEndsOnMonth = endsOn.daysInMonth();
      var firstDay = begin.month() === endsOn.month() ? begin.date() : 1
      var daysChoice = []
      for (let i = firstDay; i <= daysInEndsOnMonth; i++) daysChoice.push(i)
      return daysChoice
    }
  }
  const endsOnDayChoiceArr = useMemo(endsOnDayChoice, [newEndsOn, formData.begin, formData.repeatedData.every])

  //TODO finire qui
  const endsOnMonthChoice = () => {
    const begin = dayjs(formData.begin)
    const endsOn = dayjs(formData.repeatedData.endsOn)
    const firstMonth = begin.year() === endsOn.year() ? begin.month() : 0
    console.log(begin.year()+" == "+endsOn.year()+" ? "+(begin.year() === endsOn.year()))
    if (begin.year() === endsOn.year()) {
      const monthsTilTheEnd = 12 - firstMonth
      const monthsChoice = Array.from({ length: monthsTilTheEnd }, (_, i) => firstMonth + i)
      console.log(monthsChoice)
      return monthsChoice
    } else {
      const monthsTilTheEnd = 12
      const monthsChoice = Array.from({ length: monthsTilTheEnd }, (_, i) => i)
      console.log(monthsChoice)
      return monthsChoice
    }

  }
  const endsOnMonthChoiceArr = useMemo(endsOnMonthChoice, [newEndsOn, formData.begin, formData.repeatedData.every])

  const endsOnYearChoice = () => Array.from({ length: 100 }, (_, i) => dayjs(formData.end).year() + i)
  const endsOnYearChoiceArr = useMemo(endsOnYearChoice, [newEndsOn, formData.begin])

  const showIfNotRepeatsEvery = (options) => {
    var result = false
    for (let option of options) result |= formData.repeatedData.every === option
    return !result
  }

  useEffect(() => {
    if (!duping) {
      setFormData(event_data())
      setAllDay(selectedEvent?.allDay || false)
      setRepeated(selectedEvent?.repeated || false)
    }

    return () => {
      setDuping(false)
    }
  }, [showEventModal, selectedEvent])

  useEffect(() => {}, [selectingBeginDate])

  const handleChangeNewEndsOn = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    const new_ends_on = {
      ...newEndsOn,
      [name]: value
    }
    console.log(new_ends_on)
    setNewEndsOn(new_ends_on)
  }

  //const handleChangeNewEndsOn = (e) => {
  //  const { name, value } = e.target
  //  console.log(name, value)
  //  var new_ends_on = {
  //    ...newEndsOn,
  //    [name]: value
  //  }
  //  if (name === "day") setSelectingEndsOnNewDay(false)
  //  else if (name === "month") {
  //    new_ends_on.monthName = monthsNames[new_ends_on.month]
  //    setSelectingEndsOnNewMonth(false)
  //  } 
  //  else setSelectingEndsOnNewYear(false)

  //  setNewEndsOn(new_ends_on)
  //}

  const resetEndsOn = () => {
    const resettedEndsOn = dayjs(formData.end).startOf("day")
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn: resettedEndsOn
      }
    }
    const new_ends_on = { day: resettedEndsOn.date(), month: resettedEndsOn.month(), year: resettedEndsOn.year() }
    setNewEndsOn(new_ends_on)
    setFormData(newFormData)
    setSelectingEndsOn(false)
  }
  const handleConfirmNewEndsOn = () => {
    const endsOn = dayjs({...newEndsOn}).valueOf()
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn
      }
    }
    setFormData(newFormData)
    const new_ends_on = 
    setSelectingEndsOn(false)
  }

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    }
    setFormData(newFormData)
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

  //TODO
  const handleChangeTime = (e) => {
    console.log(e.target.name, e.target.value)
    const [ hour, minute ] = e.target.value.split(':')
    const current_date = dayjs(e.target.name === "begin" ? formData.begin : formData.end);
    const new_date = dayjs({ year: current_date.year(), month: current_date.month(), day: current_date.date(), hour, minute });
    console.log("current_date", current_date);
    console.log("new_date", new_date);
    const newFormData = { ...formData };
    if (e.target.name === "begin") newFormData.begin = new_date;
    else newFormData.end = new_date;
    // TODO c'è la funzione diff di dayjs
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
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn: dayjs(e.target.value).valueOf()
      }
    }
    setFormData(newFormData)
    setSelectingEndsOn(false);
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
    const newFormData = {
      ...formData,
      label: new_label.split("-")[1],
    }
    setFormData(newFormData)
  }

  const handleChangeCalendarType = (e) => {
    const isTask = e.target.value === "attività" ? true : false;
    const newFormData = {
      ...formData,
      isTask: isTask ? { completed: false } : null
    }
    setFormData(newFormData);
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
    //setSelectedweek(dayjs());
  }

  const handleSubmit = async (e) => {
    setIsCreatingOrModifying(true);
    if (!formData.title) {
      let tipo = (selectedEvent ? "modifica " : "creazione ")+(formData.isTask ? "attività" : "evento");
      notify("error", tipo+" - inserisci il titolo");
      return;
    }
    // if (!validateForm(formData)) {
    //   notify("error", "...")
    //   return; TODO
    // }
    e.preventDefault();

    const type = formData.isTask ? "attività" : "evento"
    const types = formData.isTask ? "attività" : "eventi"
    const type_art = formData.isTask ? "l'attività" : "l'evento"
    const types_art = formData.isTask ? "le attività" : "gli eventi"
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
          //console.log(`modifying ${modified_events.length} ${type}s`, modified_events)
          if (modified_events.length === 0) throw new Error(`non è stato possibile modificare ${types_art}`)
          else {
            allEvents_modifyEvents(modified_events)
            notify("Calendario", `${modified_events.length} ${types} modificat${event.isTask ? "e" : "i"}`)
          }
        } else {
          const modified_event = await modifyEvent(event, user)
          if (!modified_event) throw new Error(`non è stato possibile modificare ${type_art}`);
          else {
            allEvents_modifyEvents([event])
            notify("Calendario", `${type} modificat${event.isTask ? "a" : "o"}`)
          }
        }
      } catch(error) {
        console.error("Error modifying event:", error.message);
        notify("error", error.message);
      }
    } else {
      try {
        const created_events = await createEvent(event, user)
        if (!created_events) {
          if (event.repeated) throw new Error(`non è stato possibile creare ${types_art}`);
          else throw new Error(`non è stato possibile creare ${type_art}`);
        } else {
          allEvents_createEvents(created_events)
          if (created_events.length === 1) notify("Calendario", `${type} creat${event.isTask ? "a" : "o"}`)
          else notify("Calendario", `${created_events.length} ${types} creat${event.isTask ? "e" : "i"}`)
        }
      } catch(error) {
        console.error('Error creating event:', error.message);
        notify("error", error.message);
      }
    }
    //TODO non è molto bello che si chiuda all'improvviso quando ha finito, ma sì dai
    closeModal();
    setIsCreatingOrModifying(false);
  }

  const duplicateEventContent = () => {
    setDuping(true)
    const duplicateEvent = {
      ...selectedEvent,
      repeatedData: {
        ...selectedEvent.repeatedData,
        rep_id: ""
      }
    }
    delete duplicateEvent._id
    setSelectedEvent(null)
    setFormData(duplicateEvent)
  }

  const formatEndsOnDate = () => {
    const endsOn = dayjs(formData.repeatedData.endsOn)
    if (showIfNotRepeatsEvery(["month", "year"])) return endsOn.format("dddd D MMMM YYYY")
    else if (showIfNotRepeatsEvery(["month"])) return endsOn.format("YYYY")
    else return endsOn.format("MMMM YYYY") 

  }

  return (
    <div className="h-full max-w-auto flex justify-right items-right">
      {/*<div id="events_container" style={{scrollbarWidth: "thin"}} className="h-[400px] min-w-[500px] mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">*/}
      <form onSubmit={handleSubmit} className={`${colors.CALENDAR_BG_DARK} w-100 border ${colors.MAIN_BORDER_DARK} rounded-xl`}>
        <header className={`${colors.CALENDAR_BG_MEDIUM} px-4 py-1 pb-3 flex rounded-t-lg justify-between items-start`}>
          <div className="px-3"></div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex space-x-2 my-2 justify-center">
              <button type="submit" className={`text-xl px-2 py-1 ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded ${isCreatingOrModifying ? "animate-bounce" : ""}`}>{selectedEvent ? "Modifica "+(modifyRepeated ? "ripetuti" : "") : "Crea"}</button>
              { formData.isTask && <p>TODO</p>}
              { selectingCalendarType ?
                <select className={`text-xl ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded px-2 max-w-30`} onChange={(e) => {handleChangeCalendarType(e); setSelectingCalendarType(false)}}>
                  <option value="">scegli</option>
                  <option value="evento">evento</option>
                  <option value="attività">attività</option>
                </select>
                :
                <span className={`items-center flex text-xl cursor-pointer ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} min-w-[40px] px-[18px] rounded`} onClick={() => setSelectingCalendarType(true)}>{formData.isTask ? "attività" : "evento"}</span>
              }
            </div>
            <div className="flex space-x-2">
              { selectingBeginDate ?
                <>
                <div className={`flex ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} space-x-4 pr-3 rounded py-1`}>
                  <input type="date" name="date" value={dayjs(formData.begin).format("YYYY-MM-DD")} className={`rounded pl-3 bg-inherit text-xl`} onChange={handleChangeBeginDate}/>             
                </div>
                </>
                :
                <span className={`text-xl rounded ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} px-2 py-1 cursor-pointer`} onClick={() => setSelectingBeginDate(true)}>{dayjs(formData.begin).format("dddd D MMMM YYYY")}</span>
              }
            </div>
          </div>

          <button type="button" onClick={closeModal}>
            <span className="material-symbols-outlined text-white rounded w-4 mt-2" tabIndex="0">
              close
            </span>
          </button>
        </header>
        <div style={{scrollbarWidth: "thin"}} className="flex flex-col items-center max-w-full min-w-[450px] p-3 max-h-[500px] overflow-auto">
          <input className={`rounded my-3 text-xl font-semibold p-3 text-center placeholder:text-white ${colors.BUTTON_BG} ${colors.BUTTON_FOCUS_BG}`} type="textarea" name="title" placeholder="Titolo" value={formData.title} onChange={handleChange} maxLength="50" required />
          <div className="mb-4 mt-2 text-white flex items-center justify-center">
            <span onClick={handleChangeAllDay} tabIndex="0" onKeyPress={(e) => { if (e.key === ' ') handleChangeAllDay() }}
                  className={`border rounded  cursor-pointer px-2 py-1 ${colors.BUTTON_HOVER_BG} ${allDay ? "border-transparent "+colors.BUTTON_BG  : "hover:border-transparent"}`}
            >
              Tutto il giorno
            </span>
          </div>
          { !allDay && <div className="flex flex-col items-center">
            <span>Inizia alle</span>
            { selectingBeginHour ? 
              <input className={`mb-4 mt-2 px-2 py-1 ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded`} 
                   type="time" step="900" min="06:00" max="23:00" name="begin" value={dayjs(formData.begin).format("HH:mm")} onChange={handleChangeTime}
              />
              :
              <div className={`rounded mb-4 mt-2 px-2 py-1 ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} cursor-pointer`} onClick={() => setSelectingBeginHour(true)}>{dayjs(formData.begin).format("HH:mm")}</div>
            }
            <span>Finisce</span>
            <div className="flex flex-col items-center justify-content-center justify-center">
              { selectingEndDate ?
                <>
                <input type="datetime-local" name="date" value={dayjs(formData.end).format("YYYY-MM-DDTHH:mm")}
                       className={`my-2 py-1 px-2 rounded ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG}`}
                       onChange={handleChangeEndDate} 
                />             
                </>
                :
                <span className={`${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded my-2 px-2 py-1 cursor-pointer`} onClick={() => setSelectingEndDate(true)}>
                  {dayjs(formData.end).startOf("day").isSame(dayjs(formData.begin).startOf("day")) ? "Lo stesso giorno" : dayjs(formData.end).format("dddd D MMMM YYYY")}
                  &nbsp;alle&nbsp;
                  {dayjs(formData.end).format("HH:mm")}
                </span>
              }
            </div>
          </div>}
          { selectedEvent ? 
            <>
            <div className="my-4 p-2 flex flex-col max-w-[300px] border border-red-500 text-center">
              <p className="">Non puoi modificare le opzioni di ripetizione per un evento ripetuto.</p>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <div className="flex flex-col">
                  <span>Crea un nuovo evento</span>
                  <span>con lo stesso contenuto</span>
                </div>
                <button className="material-icons-outlined" type="button" onClick={duplicateEventContent}>content_copy</button>
              </div>
            </div>
            </>
            :
            <>
            <div className="mb-4 mt-2 text-white flex items-center justify-center">
              <span onClick={handleChangeRepeated} tabIndex="0" onKeyPress={(e) => { if (e.key === ' ') handleChangeRepeated() }}
                    className={`border rounded  cursor-pointer p-1 ${colors.BUTTON_HOVER_BG} ${repeated ? "border-transparent "+colors.BUTTON_BG : "hover:border-transparent"}`}
              >
                Si ripete
              </span>
            </div>
            { repeated && <div className="flex-col flex items-center justify-center justify-content-center">
              <div className="flex flex-col space-x-4 items-center">
                <span className="">Ogni</span>
                <select className={`p-1 mt-2 rounded mb-4 ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG}`}
                        defaultValue={formData.repeatedData.every} onChange={handleChangeRepeatedEvery} required>
                  <option value="">-----</option>
                  <option value="day">giorno</option>
                  <option value="week">settimana, di {dayjs(formData.begin).format("dddd")}</option>
                  <option value="month">mese, il giorno {dayjs(formData.begin).format("D")}</option>
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
                      <input type="radio" value="endsOn" name="repeated_type" onChange={handleChangeRepetitionOption} checked={formData.repeatedData.type === "endsOn"} required/>
                      { selectingEndsOn ? <div className="ml-2 flex flex-col">
                          <div className="border-b mb-1 py-2 flex items-center justify-center space-x-2">
                            { showIfNotRepeatsEvery(["month", "year"]) && 
                              <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`}
                                      name="day" onChange={handleChangeNewEndsOn} defaultValue={newEndsOn.day}>
                                { endsOnDayChoiceArr.map(day => <option key={day} value={day}>{day}</option>) }
                              </select>
                            }
                            { showIfNotRepeatsEvery(["year"]) &&
                              <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                                      name="month" onChange={handleChangeNewEndsOn} defaultValue={newEndsOn.month}>
                                { endsOnMonthChoiceArr.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                              </select>
                            }
                            <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                                    name="year" onChange={handleChangeNewEndsOn} defaultValue={newEndsOn.year}>
                              { endsOnYearChoiceArr.map(year => <option key={year} value={year}>{year}</option>) }
                            </select>
                          </div>
                          <div className="flex items-center justify-center">
                            <button type="button" className="material-symbols-outlined" onClick={handleConfirmNewEndsOn}>check</button>
                            <div className="p-1 px-4"><Button click={resetEndsOn} label="Oggi"/></div>
                            <button type="button" className="material-symbols-outlined" onClick={() => setSelectingEndsOn(false)}>close</button>
                          </div>
                        </div>
                        :
                        <Button click={() => setSelectingEndsOn(true)} label={formatEndsOnDate()} otherCss={"ml-2"}/>
                      }
                    </div>
                    <div className="ml-4">
                      <input type="radio" value="endsAfter" name="repeated_type"
                             onChange={handleChangeRepetitionOption} checked={formData.repeatedData.type === "endsAfter"} required/>
                      <label className="ml-2">dopo</label>
                      <input type="number" className={`max-w-[50px] ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} pl-1 mt-2 rounded mx-3`} value={formData.repeatedData.endsAfter || 2} onChange={handleChangeRepetitionEndsAfter} min="2" max="365"/>
                      <span>occorrenze</span>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>}
          </>}
          <textarea style={{scrollbarWidth: "thin"}}
            className={`rounded p-2 my-3 mb-4 min-w-[400px] min-h-[90px] text-center placeholder:text-white ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG}`}
            name="description" placeholder="Descrizione" value={formData.description} onChange={handleChange} />
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
