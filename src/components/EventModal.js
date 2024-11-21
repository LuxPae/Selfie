//[TODO]
// - aiut, dunque: le date e gli orari per qualche motivo non si aggiornano nel formdata anche se gli dici setFormData (newBeginDate, newEndDate in particolare)
// - modificare il giorno di un evento fa esplodere tutto
import { useContext, useEffect, useState, useMemo } from "react";
import GlobalContext from "../context/GlobalContext";
import Button from "../components/Button.js"
import { getEventsByRepId, createSingleEvent, createRepeatedEvent, modifyEvent } from "../API/events.js";
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"
import { monthsNames } from "../scripts/CONSTANTS.js"

const labelsClasses = [...Object.values(colors.labelsBackground)]

export default function EventModal() {
  var { user, showEventModal, setShowEventModal, selectedDay, setSelectedDay, currentDate, allEvents_createEvents, allEvents_modifyEvents, selectedEvent, setSelectedEvent, notify, modifyRepeated, multipleDaysEvents } = useContext(GlobalContext)

  const roundMinutes = (minutes) => (Math.ceil(minutes/15)*15)%60

  const current_hour_date = (date, from) => {
    date = dayjs(date)
    var d;
    if (date.startOf("day").isSame(currentDate.startOf("day"))) {
      d = dayjs(date).startOf("minute");
    } else {
      d = selectedDay.add(currentDate.hour(), "hour").add(currentDate.minute(), "minute");
    }
    const minute = roundMinutes(d.minute())
    const final_date = dayjs({day: d.date(), month: d.month(), year: d.year(), hour: d.hour(), minute })
    //console.log("Final date "+from, final_date)
    return final_date
  }

  const event_data = () => (selectedEvent || {
    title: "",
    description: "",
    label: "white",
    allDay: false,
    isTask: null,
    begin: current_hour_date(selectedDay, "formData begin").valueOf(),
    end: current_hour_date(selectedDay, "formData end").add(1, "hour").valueOf(),
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

  const [newBeginDate, setNewBeginDate ] = useState((() => {
    const beginDate = selectedEvent ? dayjs(selectedEvent) : dayjs(selectedDay)
    return ({ day: beginDate.date(), month: beginDate.month(), year: beginDate.year(), hour: beginDate.format("H"), minute: roundMinutes(beginDate.format("m")) })
  })())
  const [selectingBeginDate, setSelectingBeginDate] = useState(false)
  const [selectingBeginHour, setSelectingBeginHour] = useState(false)

  const [selectingEndDate, setSelectingEndDate] = useState(false)
  const [newEndDate, setNewEndDate ] = useState((() => {
    const endDate = selectedEvent ? dayjs(selectedEvent.end) : current_hour_date(dayjs(formData.end), "new end date")
    const end_day_obj = { day: endDate.date(), month: endDate.month(), year: endDate.year(), hour: endDate.format("H"), minute: roundMinutes(endDate.format("m")) }
    return end_day_obj
  })())

  const [isCreatingOrModifying, setIsCreatingOrModifying] = useState(false)
  const [duping, setDuping] = useState(false)
  const [allDay, setAllDay] = useState(false);
  const [repeated, setRepeated] = useState(false);

  const [selectingEndsOn, setSelectingEndsOn] = useState(false)
  const [newEndsOn, setNewEndsOn ] = useState((() => {
    const endsOnDate = selectedEvent ? dayjs(selectedEvent) : dayjs(selectedDay)
    return ({ day: endsOnDate.date(), month: endsOnDate.month(), year: endsOnDate.year() })
  })())

  const daysInMonthArray = (date) => Array.from({length: dayjs(date).daysInMonth()}, (_, i) => i+1)
  const endsOnDaysChoice = () => {
    const begin = dayjs(formData.begin)
    const endsOnDate = dayjs({...newEndsOn})
    if (formData.repeated && formData.repeatedData.every === "week") {
      var dates = []
      let i = 1
      const firstDate = begin.month() === endsOnDate.month() ? begin : endsOnDate.startOf("month")
      let date = firstDate
      while (!date.isAfter(endsOnDate.endOf("month"))) {
        if (date.day() === begin.day()) dates.push(date)
        date = firstDate.add(i, "day")
        i++
      }
      const daysChoice = dates.map(d => d.date())
      return daysChoice
    } else return daysInMonthArray(endsOnDate)
  }
  const endsOnDaysChoiceArray = useMemo(() => endsOnDaysChoice(), [formData.repeatedData.every, newEndsOn.month])
  const monthsArray = Array.from({length:12}, (_, i) => i)
  const yearsChoiceArray = Array.from({ length: 100 }, (_, i) => 2000 + i)
  const hoursChoiceArray = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'))
  const minutesChoiceArray = Array.from({length: 4}, (_, i) => (i*15).toString().padStart(2, '0'))

  const showIfNotRepeatsEvery = (options) => {
    var result = false
    for (let option of options) result |= formData.repeatedData.every === option
    return !result
  }

  // END DATE
  const resetEndDate = () => {
    const resettedEndDate = dayjs(formData.begin).add(1, "hour")
    const newFormData = {
      ...formData,
      end: resettedEndDate.valueOf()
    }
    const new_end_date = { day: resettedEndDate.date(), month: resettedEndDate.month(), year: resettedEndDate.year(), hour: resettedEndDate.hour(), minute: resettedEndDate.minute() }
    setNewEndDate(new_end_date)
    setFormData(newFormData)
    setSelectingEndDate(false)
  }
  const handleConfirmEndDate = () => {
    const endDate = dayjs({...newEndDate})
    console.log(endDate.format("dddd D MMMM YYYY HH:mm"))
    const newFormData = {
      ...formData,
      end: endDate.valueOf()
    }
    console.log("new form data (changed end date)", niceFormData(newFormData))
    setFormData(newFormData)
    setSelectingEndDate(false)
  }

  const handleChangeNewEndDate = (e) => {
    const name = e.target.name
    const value = parseInt(e.target.value)
    //console.log("name: ", name)
    //console.log("value: ",value)
    const new_end_date = {
      ...newEndDate,
      [name]: value
    }
    console.log(new_end_date)
    setNewEndDate(new_end_date)
  }
  
  // ~ END DATE
  
  // ENDS ON
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
  const handleConfirmEndsOn = () => {
    const endsOn = dayjs({...newEndsOn}).valueOf()
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn
      }
    }
    setFormData(newFormData)
    setSelectingEndsOn(false)
  }
  // ~ ENDS ON

  // BEGIN DATE
  const setTodayBeginDate = () => {
    const new_begin = { day: currentDate.date(), month: currentDate.month(), year: currentDate.year(), hour: currentDate.hour(), minute: currentDate.minute() }
    setNewBeginDate(new_begin)
    const beginDate = dayjs({...new_begin})
    const newFormData = {
      ...formData,
      begin: beginDate.valueOf()
    }
    setFormData(newFormData)
    setSelectingBeginDate(false)
  }

  const resetBeginDate = (from) => {
    const resettedBegin = current_hour_date(dayjs(formData.begin), "reset begin date")
    const newFormData = {
      ...formData,
      begin: resettedBegin.valueOf()
    }
    const new_begin = { day: resettedBegin.date(), month: resettedBegin.month(), year: resettedBegin.year(), hour: resettedBegin.hour(), minute: resettedBegin.minute() }
    setNewBeginDate(new_begin)
    setFormData(newFormData)
    if (from === "date") setSelectingBeginDate(false)
    else setSelectingBeginHour(false)
  }

  const handleConfirmBeginDate = (from) => {
    const beginDate = dayjs({...newBeginDate})
    //console.log("New begin date:", beginDate.format("dddd D MMMM YYYY HH:mm"))
    const newFormData = {
      ...formData,
      begin: beginDate.valueOf()
    }
    setFormData(newFormData)
    if (from === "date") setSelectingBeginDate(false)
    else setSelectingBeginHour(false)
  }

  const handleChangeNewBeginDate = (e) => {
    const { name, value } = e.target
    const new_begin = {
      ...newBeginDate,
      [name]: parseInt(value)
    }
    //console.log("New begin:", new_begin)
    setNewBeginDate(new_begin)
  }
  // ~ BEGIN DATE

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
      begin: current_hour_date(e.target.value, "change begin date")
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
    const new_begin = dayjs(formData.begin).startOf("day")
    const newFormData = {
      ...formData,
      begin: new_begin,
      allDay: new_value
    }
    setAllDay(new_value);
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

  //TODO validator for time
  const handleChangeTime = (e) => {
    //console.log(e.target.name, e.target.value)
    const [ hour, minute ] = e.target.value.split(':')
    const current_date = dayjs(e.target.name === "begin" ? formData.begin : formData.end);
    const new_date = dayjs({ year: current_date.year(), month: current_date.month(), day: current_date.date(), hour, minute });
    //console.log("current_date", current_date);
    //console.log("new_date", new_date);
    const newFormData = { ...formData };
    if (e.target.name === "begin") newFormData.begin = new_date;
    else newFormData.end = new_date;
    // TODO c'è la funzione diff di dayjs
    const duration = Math.floor((dayjs(newFormData.end).subtract(dayjs(newFormData.begin))).valueOf() / (1000*60*60));
    //console.log(duration);
    if (duration < 0) {
      notify("error", "L'ora di fine deve essere successiva all'ora di inizio")
    } else {
      setFormData(newFormData);
      //console.log(newFormData);
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
    const isThisTask = e.target.value === "attività" ? true : false;
    const newFormData = {
      ...formData,
      isTask: isThisTask ? { completed: false } : null
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
  }

  const doesEventLastsMoreThanOneDay = (event) => !dayjs(event.begin).startOf("day").isSame(dayjs(event.end).startOf("day"))

  const setLastMoreDaysInfo = (event) => {
    if (!doesEventLastsMoreThanOneDay(event)) return null
    const day_in_ms = 1000*60*60*24
    const durata_in_giorni = (dayjs(event.end).startOf("day").diff(dayjs(event.begin).startOf("day"))/day_in_ms)+1
    const info = {
      num: 1,
      total: durata_in_giorni
    }
    return info
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
      lastsMoreDays: setLastMoreDaysInfo(formData),
      repeatedData: {
        ...formData.repeatedData,
        rep_id: generate_id(formData.repeatedData)
      }
    };
    console.log(event)
    if (selectedEvent) {
      if (!selectedEvent.lastsMoreDays) {
        event = {
          ...event,
          _id: selectedEvent._id,
          repeatedData: selectedEvent.repeatedData
        };
      } else {
        const md_event = multipleDaysEvents.find(e => e._id === event._id)
        event = {
          ...event,
          begin: md_event.begin,
          end: md_event.end,
          lastsMoreDays: md_event.lastsMoreDays,
          repeatedData: md_event.repeatedData
        }
        console.log("multiple days event", md_event)
        console.log("modified event", event)
      }
      try {
        if (modifyRepeated) {
          const modified_events = await modifyEvent(event, user, true)
          console.log(`modifying ${modified_events.length} ${type}s`, modified_events)
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
        var created_events = null;
        if (!event.repeated) {
          let e = await createSingleEvent(event, user)
          if (e) created_events = [e]
        }
        else created_events = await createRepeatedEvent(event, user)
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

  //TODO cheat (perché per qualche motivo astrale end date cambia nel formdata, ma qui non ne vuole sapere proprio)
  // e infatti non funzionaaaaAAAAAAA
  const formattedEndDate = useMemo(() => {
    const begin = dayjs(formData.begin)
    const end = dayjs(formData.end)
    var formattedDate = "";
    if (end.startOf("day").isSame(begin.startOf("day"))) formattedDate = "Lo stesso giorno"
    else formattedDate = end.format("dddd D MMMM YYYY")
    formattedDate += " alle "+dayjs({...newEndDate}).format("HH:mm")
    return formattedDate
  }, [formData.end])

  useEffect(() => {
    //TODO perché l'avevo messo?
    if (!duping /*&& !formData*/) {
      setFormData(event_data())
      setAllDay(selectedEvent?.allDay || false)
      setRepeated(selectedEvent?.repeated || false)
    }

    return () => {
      setDuping(false)
    }
  }, [showEventModal, selectedEvent, setSelectedEvent, selectingBeginDate, selectingEndDate ])

  const niceFormData = (otherFormData) => {
      const formData = otherFormData || formData
    return {
      ...formData,
      begin: dayjs(formData.begin).format("dddd D MMMM YYYY HH:mm"),
      end: dayjs(formData.end).format("dddd D MMMM YYYY HH:mm")
    }
  }
  //useEffect(() => {
  //  const niceFormData = {
  //    ...formData,
  //    begin: dayjs(formData.begin).format("dddd D MMMM YYYY HH:mm"),
  //    end: dayjs(formData.end).format("dddd D MMMM YYYY HH:mm")
  //  }
  //  console.log("Formdata:", niceFormData)
  //}, [formData])

  return (
    <div className="h-full max-w-auto flex justify-right items-right">
      {/*<div id="events_container" style={{scrollbarWidth: "thin"}} className="h-[400px] min-w-[500px] mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">*/}
      <form onSubmit={handleSubmit} className={`${colors.CALENDAR_BG_DARK} w-100 border ${colors.MAIN_BORDER_DARK} rounded-xl`}>
        <header className={`${colors.CALENDAR_BG_MEDIUM} px-4 py-1 pb-3 flex rounded-t-lg justify-between items-start`}>
          <div className="px-3"></div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex space-x-2 my-2 justify-center">
              <button type="submit" className={`text-xl px-2 py-1 ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded ${isCreatingOrModifying ? "animate-bounce" : ""}`}>{selectedEvent ? "Modifica "+(modifyRepeated ? "ripetuti" : "") : "Crea"}</button>
              <select className={`appearance-none text-center px-2 py-1 text-xl ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded px-2 max-w-30`}
                      onChange={handleChangeCalendarType} defaultValue={formData.isTask ? "attività" : "evento"}>
                <option value="evento">evento</option>
                <option value="attività">attività</option>
              </select>
            </div>
            <div className="flex space-x-2">
              { selectingBeginDate ? <div className="flex flex-col items-center mt-2">
                  <div className="border-b pb-2 mb-1 flex items-center space-x-2">
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`}
                            name="day" onChange={handleChangeNewBeginDate} defaultValue={newBeginDate.day}>
                      {daysInMonthArray(dayjs({...newBeginDate})).map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="month" onChange={handleChangeNewBeginDate} defaultValue={newBeginDate.month}>
                      { monthsArray.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                    </select>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="year" onChange={handleChangeNewBeginDate} defaultValue={newBeginDate.year}>
                      {/* beginDateYearsChoiceArr.map(year => <option key={year} value={year}>{year}</option>) */}
                      { yearsChoiceArray.map(year => <option key={year} value={year}>{year}</option>) }
                    </select>
                  </div>
                  <div className="flex items-center justify-center">
                    <button type="button" className="material-symbols-outlined" onClick={() => handleConfirmBeginDate("date")}>check</button>
                    <div className="p-1 px-4"><Button click={setTodayBeginDate} label="Oggi"/></div>
                    <button type="button" className="material-symbols-outlined" onClick={() => setSelectingBeginDate(false)}>close</button>
                  </div>
                </div>
                :
                <Button click={() => setSelectingBeginDate(true)} label={dayjs(formData.begin).format("dddd D MMMM YYYY")} otherCss={"text-xl"}/>
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
            <span className="mb-1">{formData.isTask ? "Alle" : "Inizia alle"}</span>
            { selectingBeginHour ? <div className="flex flex-col items-center mb-4">
                <div className="flex items-center space-x-2">
                  <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`}
                          name="hour" onChange={handleChangeNewBeginDate} defaultValue={dayjs(formData.begin).format("HH")}>
                    { hoursChoiceArray.map(hour => <option key={hour} value={parseInt(hour)}>{hour}</option>) }
                  </select>
                  <p>:</p>
                  <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                          name="minute" onChange={handleChangeNewBeginDate} defaultValue={dayjs(formData.begin).format("mm")}>
                    { minutesChoiceArray.map(minute => <option key={minute} value={parseInt(minute)}>{minute}</option>) }
                  </select>
                  {/* TODO: handleChangeTime
                      <input className={`mb-4 mt-2 px-2 py-1 ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded`} 
                       type="time" step="900" min="06:00" max="23:00" name="begin" value={dayjs(formData.begin).format("HH:mm")} onChange={handleChangeTime}
                  />*/}
                </div>
                <div className="mt-2 pt-1 border-t flex items-center justify-center">
                  <button type="button" className="material-symbols-outlined" onClick={handleConfirmBeginDate}>check</button>
                  <div className="p-1 px-4"><Button click={resetBeginDate} label="Reset"/></div>
                  <button type="button" className="material-symbols-outlined" onClick={() => setSelectingBeginHour(false)}>close</button>
                </div>
              </div>
              :
              <Button click={() => setSelectingBeginHour(true)} label={dayjs(formData.begin).format("HH:mm")} otherCss="mb-4"/>
            }
            { !formData.isTask && <>
              <span className="mb-2">Finisce</span>
              { selectingEndDate ? <div className="flex flex-col mb-4">
                  <div className="border-b mb-1 pb-2 flex flex-col items-center justify-center space-x-2">
                    <div className="flex items-center mb-2 space-x-2">
                      <span>il </span>
                      <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`}
                              name="day" onChange={handleChangeNewEndDate} defaultValue={newEndDate.day}>
                        { daysInMonthArray(dayjs({...newEndDate})).map(day => <option key={day} value={day}>{day}</option>) }
                      </select>
                      <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                              name="month" onChange={handleChangeNewEndDate} defaultValue={newEndDate.month}>
                        {/* endDateMonthsChoiceArr.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) */}
                        { monthsArray.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                      </select>
                      <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                              name="year" onChange={handleChangeNewEndDate} defaultValue={newEndDate.year}>
                        { yearsChoiceArray.map(year => <option key={year} value={year}>{year}</option>) }
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p> alle </p>
                      <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                              name="hour" onChange={handleChangeNewEndDate} defaultValue={newEndDate.hour/*dayjs(formData.end).hour()*/}>
                        { hoursChoiceArray.map(hour => <option key={hour} value={parseInt(hour)}>{hour}</option>) }
                      </select>
                      <p>:</p>
                      <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                              name="minute" onChange={handleChangeNewEndDate} defaultValue={newEndDate.minute}>
                        { minutesChoiceArray.map(minute => <option key={minute} value={parseInt(minute)}>{minute}</option>) }
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button type="button" className="material-symbols-outlined" onClick={handleConfirmEndDate}>check</button>
                    <div className="p-1 px-4"><Button click={resetEndDate} label="Reset"/></div>
                    <button type="button" className="material-symbols-outlined" onClick={() => setSelectingEndDate(false)}>close</button>
                  </div>
                </div>
                :
                <Button click={() => setSelectingEndDate(true)} label={formattedEndDate} otherCss="mb-4"/>
              }
            </>}
          </div>}
          { selectedEvent ? 
            <>
            <div className="my-4 p-2 flex flex-col max-w-[300px] border border-red-500 text-center">
              <p className="text-sm">Non puoi modificare le opzioni di ripetizione.</p>
              <div className="flex items-center justify-center space-x-4 mt-3">
                <div className="flex flex-col">
                  <span className="text-sm">Crea un nuovo evento</span>
                  <span className="text-sm">con lo stesso contenuto</span>
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
                    <legend className="mb-2">Termina</legend>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex ml-4 mb-2">
                      <input type="radio" value="endsOn" name="repeated_type" onChange={handleChangeRepetitionOption} checked={formData.repeatedData.type === "endsOn"} required/>
                      { selectingEndsOn ? <div className="ml-2 flex flex-col">
                          <div className="border-b mb-1 py-2 flex items-center justify-center space-x-2">
                            { showIfNotRepeatsEvery(["month", "year"]) && 
                              <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`}
                                      name="day" onChange={handleChangeNewEndsOn} defaultValue={newEndsOn.day}>
                                { endsOnDaysChoiceArray.map(day => <option key={day} value={day}>{day}</option>) }
                              </select>
                            }
                            { showIfNotRepeatsEvery(["year"]) &&
                              <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                                      name="month" onChange={handleChangeNewEndsOn} defaultValue={newEndsOn.month}>
                                { monthsArray.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                              </select>
                            }
                            <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                                    name="year" onChange={handleChangeNewEndsOn} defaultValue={newEndsOn.year}>
                              { yearsChoiceArray.map(year => <option key={year} value={year}>{year}</option>) }
                            </select>
                          </div>
                          <div className="flex items-center justify-center">
                            <button type="button" className="material-symbols-outlined" onClick={handleConfirmEndsOn}>check</button>
                            <div className="p-1 px-4"><Button click={resetEndsOn} label="Reset"/></div>
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
