import { useContext, useEffect, useState, useMemo } from "react"
import GlobalContext from "../context/GlobalContext"
import Button from "../components/Button.js"
import { createSingleEvent, createRepeatedEvent, modifyEvent } from "../API/events.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"
import { monthsNames } from "../scripts/CONSTANTS.js"

export default function EventModal() {
  var { user, showEventModal, setShowEventModal, selectedDay, currentDate, allEvents_createEvents, allEvents_modifyEvents, selectedEvent, isCreatingNewEvent, setIsCreatingNewEvent, setSelectedEvent, notify, modifyRepeated, multipleDaysEvents, duplicatedEvent, setDuplicatedEvent } = useContext(GlobalContext)

  const roundMinutes = (minutes) => (Math.ceil(minutes/15)*15)%60

  const current_hour_date = (date, begin) => {
    const relativeBeginDate = begin ? dayjs(begin) : currentDate
    date = dayjs(date)
    var d
    d = date.startOf("day").add(relativeBeginDate.hour(), "hour").add(relativeBeginDate.minute(), "minute")
    const hour = d.minute() <= 45 ? d.hour() : d.hour()+1
    const minute = roundMinutes(d.minute())
    const final_date = dayjs({day: d.date(), month: d.month(), year: d.year(), hour, minute })
    return final_date
  }

  const event_data = () => (selectedEvent || {
    title: "",
    description: "",
    label: "white",
    allDay: false,
    isTask: null,
    begin: current_hour_date(selectedDay).valueOf(),
    end: current_hour_date(selectedDay).add(1, "hour").valueOf(),
    repeated: false, 
    repeatedData: {
      rep_id: "",
      every: "",
      type: "",
      endsOn: selectedDay.add(1, "day").valueOf(),
      endsAfter: 2,
    },
  })
  const [formData, setFormData] = useState(event_data())

  const [oldBeginDate, setOldBeginDate] = useState(dayjs(formData.begin))

  const [selectingBeginDate, setSelectingBeginDate] = useState(false)
  const [selectingBeginHour, setSelectingBeginHour] = useState(false)

  const [oldEndDate, setOldEndDate] = useState(dayjs(formData.end))
  const [selectingEndDate, setSelectingEndDate] = useState(false)
  const [selectingEndHour, setSelectingEndHour] = useState(false)

  const [isCreatingOrModifying, setIsCreatingOrModifying] = useState(false)
  const [allDay, setAllDay] = useState(false)
  const [repeated, setRepeated] = useState(false)

  const [oldEndsOnDate, setOldEndsOnDate] = useState(dayjs(formData.repeatedData.endsOn))
  const [selectingEndsOn, setSelectingEndsOn] = useState(false)

  const daysInMonthArray = (date) => Array.from({length: dayjs(date).daysInMonth()}, (_, i) => i+1)
  const endsOnDaysChoice = () => {
    const begin = dayjs(formData.begin)
    const endsOnDate = dayjs(formData.repeatedData.endsOn)
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
  const endsOnDaysChoiceArray = endsOnDaysChoice()
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
  const resetEndDate = (from) => {
    const resettedDate = current_hour_date(dayjs(formData.begin), dayjs(formData.begin)).add(1, "hour")
    //console.log("resetted end date:", resettedDate.format("dddd D MMMM YYYY HH:mm"))
    var newEndDate = { day: resettedDate.date(), month: resettedDate.month(), year: resettedDate.year(), hour: resettedDate.hour(), minute: resettedDate.minute() }
    newEndDate = dayjs({...newEndDate})
    const newFormData = {
      ...formData,
      end: newEndDate.valueOf()  
    }
    setFormData(newFormData)
    setOldEndDate(dayjs(newFormData.end))
    if (from === "date") setSelectingEndDate(false)
    else setSelectingEndHour(false)
  }

  const handleConfirmEndDate = (from) => {
    if (from === "date") setSelectingEndDate(false)
    else setSelectingEndHour(false)
    setOldEndDate(dayjs(formData.end))
  }

  const handleChangeEndDate = (e) => {
    var { name, value } = e.target
    const end = dayjs(formData.end)
    setOldEndDate(end)
    var newEndDate = { day: end.date(), month: end.month(), year: end.year(), hour: end.hour(), minute: end.minute() }
    newEndDate[name] = parseInt(value)
    newEndDate = dayjs({...newEndDate})
    const newFormData = {
      ...formData,
      end: newEndDate.valueOf()  
    }
    setFormData(newFormData)
  }

  const cancelEndDate = (from) => {
    const oldFormDataEnd = dayjs(formData.end)
    const newFormData = {
      ...formData,
      end: oldEndDate.valueOf()
    }
    setOldEndDate(oldFormDataEnd)
    setFormData(newFormData)
    if (from === "date") setSelectingEndDate(false)
    else setSelectingEndHour(false)
  }
  // ~ END DATE
  
  // ENDS ON
  const handleChangeEndsOn = (e) => {
    var { name, value } = e.target
    const endsOn = dayjs(formData.repeatedData.endsOn)
    setOldEndsOnDate(endsOn)
    var newEndsOn = { day: endsOn.date(), month: endsOn.month(), year: endsOn.year() }
    newEndsOn[name] = parseInt(value)
    newEndsOn = dayjs({...newEndsOn})
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn: newEndsOn.valueOf()
      }
    }
    setFormData(newFormData)
  }

  const cancelEndsOn = () => {
    const oldFormDataEndsOn = dayjs(formData.repeatedData.endsOn)
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn: oldEndsOnDate.valueOf()
      }
    }
    setOldEndsOnDate(oldFormDataEndsOn)
    setFormData(newFormData)
    setSelectingEndsOn(false)
  }

  const handleConfirmEndsOn = () => {
    setOldEndsOnDate(dayjs(formData.repeatedData.endsOn))
    setSelectingEndsOn(false)
  }

  const resetEndsOn = () => {
    const resettedDate = current_hour_date(dayjs(formData.begin), dayjs(formData.begin))
    console.log("resetted end date:", resettedDate.format("dddd D MMMM YYYY HH:mm"))
    var newEndsOn = { day: resettedDate.date(), month: resettedDate.month(), year: resettedDate.year() }
    newEndsOn = dayjs({...newEndsOn})
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        endsOn: newEndsOn.valueOf()
      }
    }
    setFormData(newFormData)
    setOldEndsOnDate(dayjs(newFormData.repeatedData.endsOn))
    setSelectingEndsOn(false)
  }
  // ~ ENDS ON

  // BEGIN DATE
  const setTodayBeginDate = () => {
    setOldBeginDate(dayjs(formData.begin))
    const newFormData = {
      ...formData,
      begin: current_hour_date(currentDate).valueOf() 
    }
    setFormData(newFormData)
    setSelectingBeginDate(false)
  }

  const cancelBeginDate = (from) => {
    const oldFormDataBegin = dayjs(formData.begin)
    const newFormData = {
      ...formData,
      begin: oldBeginDate.valueOf()
    }
    setOldBeginDate(oldFormDataBegin)
    setFormData(newFormData)
    if (from === "date") setSelectingBeginDate(false)
    else setSelectingBeginHour(false)
  }

  const handleConfirmBeginDate = (from) => {
    setOldBeginDate(dayjs(formData.begin))
    if (from === "date") setSelectingBeginDate(false)
    else setSelectingBeginHour(false)
  }

  const handleChangeBeginDate = (e) => {
    var { name, value } = e.target
    const begin = dayjs(formData.begin)
    setOldBeginDate(begin)
    var newBeginDate = { day: begin.date(), month: begin.month(), year: begin.year(), hour: begin.hour(), minute: begin.minute() }
    newBeginDate[name] = parseInt(value)
    newBeginDate = dayjs({...newBeginDate})
    const newFormData = {
      ...formData,
      begin: newBeginDate.valueOf()  
    }
    setFormData(newFormData)
  }

  const resetBeginHour = () => {
    const begin = dayjs(formData.begin)
    const resettedDate = current_hour_date(selectedDay)
    var newBeginDate = { day: begin.date(), month: begin.month(), year: begin.year(), hour: resettedDate.hour(), minute: resettedDate.minute() }
    newBeginDate = dayjs({...newBeginDate})
    const newFormData = {
      ...formData,
      begin: newBeginDate.valueOf()  
    }
    setFormData(newFormData)
    setOldBeginDate(dayjs(newFormData.begin))
    setSelectingBeginHour(false)
  }
  // ~ BEGIN DATE

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    }
    setFormData(newFormData)
  }

  const handleChangeAllDay = () => {
    const new_value = !allDay
    const new_begin = new_value ? dayjs(formData.begin).startOf("day") : oldBeginDate
    const newFormData = {
      ...formData,
      begin: new_begin,
      allDay: new_value
    }
    setAllDay(new_value)
    setFormData(newFormData)
  }

  const handleChangeRepeated = () => {
    const new_value = !repeated
    setRepeated(new_value)
    const newFormData = {
      ...formData,
      repeated: new_value
    }
    setFormData(newFormData)
  }

  // VALIDATORS
  const [validationError, setValidationError] = useState("")

  const validate_titleMinLength = () => formData.title.length > 0

  const validate_date = () => {
    const begin = dayjs(formData.begin)
    const end = dayjs(formData.end)
    const diff = end.diff(begin)
    return diff >= 0
  }

  const validate_repeatedEvery = () => formData.repeatedData.every != ""
  const validate_repeatedEnd = () => formData.repeatedData.type != ""
  const validate_repeatedEndsOnSameDay = () => {
    const begin = dayjs(formData.begin)
    const endsOn = dayjs(formData.repeatedData.endsOn)
    return !begin.startOf("day").isSame(endsOn.startOf("day"))
  }
  const validate_repeatedEndsOnBefore = () => {
    const begin = dayjs(formData.begin)
    const endsOn = dayjs(formData.repeatedData.endsOn)
    return begin.startOf("day").isBefore(endsOn.startOf("day"))
  }

  let tipo = (selectedEvent ? "modifica " : "creazione ")+(formData.isTask ? "attività - " : "evento - ")
  const validate_form = () => {
    if (!validate_titleMinLength()) {
      setValidationError("Inserisci il titolo")
      return false
    }
    else if (!validate_date()) {
      setValidationError("L'ora di fine deve essere successiva all'ora di inizio")
      return false
    }
    else if (formData.repeated && !validate_repeatedEvery()) {
      setValidationError("Scegli ogni quanto si ripete")
      return false
    }
    else if (formData.repeated && !validate_repeatedEnd()) {
      setValidationError("Scegli quando termina la ripetizione")
      return false
    }
    else if (formData.repeated && formData.repeatedData.type === "endsOn" && !validate_repeatedEndsOnSameDay()) {
      setValidationError("Non può terminare lo stesso giorno")
      return false
    }
    else if (formData.repeated && formData.repeatedData.type === "endsOn" && !validate_repeatedEndsOnBefore()) {
      setValidationError("Non può terminare prima dell'inizio")
      return false
    }
    return true
  }
  // ~ VALIDATORS

  const handleChangeRepeatedEvery = (e) => {
    const value = e.target.value
    switch (value) {
      case "day": console.log("giorno")
        break
      case "week": console.log("settimana")
        break
      case "month": console.log("mese")
        break
      case "year": console.log("anno")
        break
      default: break
    }
    const newFormData = {
      ...formData,
      repeatedData: {
        ...formData.repeatedData,
        every: value
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
    setSelectingEndsOn(false)
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
      label: new_label
    }
    setFormData(newFormData)
  }

  const handleChangeCalendarType = (e) => {
    const isThisTask = e.target.value === "attività" ? true : false
    const newFormData = {
      ...formData,
      isTask: isThisTask ? { completed: false } : null
    }
    setFormData(newFormData)
  }

  const MAX_RAND_CHARS = 16
  const generate_id = (data) => {
    const rand_chars1 = Math.random().toString(36)
    const rand_chars2 = Math.random().toString(36)
    const id = (rand_chars1 + rand_chars2.substr(2)).substr(2, MAX_RAND_CHARS);
    return id
  }

  function closeModal() {
    setShowEventModal(false)
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

  const handleSubmit = async () => {
    if (!validate_form()) return

    setIsCreatingOrModifying(true)

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
    }
    //console.log(event)
    if (selectedEvent) {
      if (!selectedEvent.lastsMoreDays) {
        event = {
          ...event,
          _id: selectedEvent._id,
          repeatedData: selectedEvent.repeatedData
        }
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
            notify([{type:"Calendario", message:`${modified_events.length} ${types} modificat${event.isTask ? "e" : "i"}`}])
          }
        } else {
          const modified_event = await modifyEvent(event, user)
          if (!modified_event) throw new Error(`non è stato possibile modificare ${type_art}`)
          else {
            allEvents_modifyEvents([event])
            notify([{type:"Calendario", message:`${type} modificat${event.isTask ? "a" : "o"}`}])
          }
        }
      } catch(error) {
        console.error("Error modifying event:", error.message)
        notify([{type:"error", message:error.message}])
      }
    } else {
      try {
        var created_events = null
        if (!event.repeated) {
          let e = await createSingleEvent(event, user)
          if (e) created_events = [e]
        }
        else created_events = await createRepeatedEvent(event, user)
        if (!created_events) {
          if (event.repeated) throw new Error(`non è stato possibile creare ${types_art}`)
          else throw new Error(`non è stato possibile creare ${type_art}`)
        } else {
          allEvents_createEvents(created_events)
          if (created_events.length === 1) notify([{type:"Calendario", message:`${type} creat${event.isTask ? "a" : "o"}`}])
          else notify([{type:"Calendario", message:`${created_events.length} ${types} creat${event.isTask ? "e" : "i"}`}])
        }
      } catch(error) {
        console.error('Error creating event:', error.message)
        notify([{type:"error", message:error.message}])
      }
    }
    closeModal()
    setIsCreatingOrModifying(false)
  }

  const formatEndsOnDate = () => {
    const endsOn = dayjs(formData.repeatedData.endsOn)
    if (showIfNotRepeatsEvery(["month", "year"])) return endsOn.format("dddd D MMMM YYYY")
    else if (showIfNotRepeatsEvery(["month"])) return endsOn.format("YYYY")
    else return endsOn.format("MMMM YYYY") 

  }

  const formattedEndDate = (() => {
    const begin = dayjs(formData.begin)
    const end = dayjs(formData.end)
    var formattedDate = ""
    if (end.startOf("day").isSame(begin.startOf("day"))) formattedDate = "Lo stesso giorno"
    else formattedDate = end.format("dddd D MMMM YYYY")
    return formattedDate
  })()

  useEffect(() => {
    if (duplicatedEvent) {
      const dup_event = {
        ...duplicatedEvent,
        repeatedData: {
          ...duplicatedEvent.repeatedData,
          rep_id: ""
        }
      }
      delete dup_event._id
      setSelectedEvent(null)
      setDuplicatedEvent(null)
      setFormData(dup_event)
    }

    if (isCreatingNewEvent) {
      setFormData(event_data())
      setAllDay(selectedEvent?.allDay || false)
      setRepeated(selectedEvent?.repeated || false)
      setIsCreatingNewEvent(false)
    }
  }, [showEventModal, selectedEvent, duplicatedEvent, isCreatingNewEvent, selectingBeginDate, selectingEndDate ])

  const niceFormData = (otherFormData) => {
      const nice_form_data = otherFormData || formData
    return {
      ...nice_form_data,
      begin: dayjs(nice_form_data.begin).format("dddd D MMMM YYYY HH:mm"),
      end: dayjs(nice_form_data.end).format("dddd D MMMM YYYY HH:mm")
    }
  }
  //useEffect(() => {
  //  console.log("FormData:", niceFormData())
  //}, [formData])

  return (
    <div onKeyPress={e => { if(e.key === 'Enter') handleSubmit()}} className={`h-screen md:h-full max-w-auto ${colors.CALENDAR_BG_DARK} w-100 border ${colors.MAIN_BORDER_DARK} rounded-xl`}>
      <header className={`${colors.CALENDAR_BG_MEDIUM} px-4 py-1 pb-6 flex rounded-t-lg justify-between items-start`}>
        <div className="px-3"></div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex space-x-2 my-2 justify-center">
            <button type="button" onClick={handleSubmit}
                    className={`text-xl px-2 py-1 ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} rounded ${isCreatingOrModifying ? "animate-bounce" : ""}`}>{selectedEvent ? "Modifica "+(modifyRepeated ? "ripetuti" : "") : "Crea"}</button>
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
                          name="day" onChange={handleChangeBeginDate} defaultValue={dayjs(formData.begin).date()}>
                    {daysInMonthArray(dayjs(formData.begin)).map(day => <option key={day} value={day}>{day}</option>)}
                  </select>
                  <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                          name="month" onChange={handleChangeBeginDate} defaultValue={dayjs(formData.begin).month()}>
                    { monthsArray.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                  </select>
                  <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                          name="year" onChange={handleChangeBeginDate} defaultValue={dayjs(formData.begin).year()}>
                    { yearsChoiceArray.map(year => <option key={year} value={year}>{year}</option>) }
                  </select>
                </div>
                <div className="flex items-center justify-center">
                  <button type="button" className="material-symbols-outlined" onClick={() => handleConfirmBeginDate("date")}>check</button>
                  <div className="p-1 px-4"><Button click={setTodayBeginDate} label="Oggi"/></div>
                  <button type="button" className="material-symbols-outlined" onClick={() => cancelBeginDate("date")}>close</button>
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
      { validationError && <p className={`text-center p-1 flex border ${colors.MAIN_BORDER_LIGHT} justify-center -translate-y-3 ${colors.MAIN_TEXT_LIGHT} ${colors.CALENDAR_BG_DARK}`}>{validationError}</p> }
      <div style={{scrollbarWidth: "thin"}} className="flex flex-col items-center max-w-full md:min-w-[450px] p-3 max-h-[500px] overflow-y-auto overflow-x-hidden">
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
                        name="hour" onChange={handleChangeBeginDate} defaultValue={dayjs(formData.begin).format("HH")}>
                  { hoursChoiceArray.map(hour => <option key={hour} value={parseInt(hour)}>{hour}</option>) }
                </select>
                <p>:</p>
                <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                        name="minute" onChange={handleChangeBeginDate} defaultValue={dayjs(formData.begin).format("mm")}>
                  { minutesChoiceArray.map(minute => <option key={minute} value={parseInt(minute)}>{minute}</option>) }
                </select>
              </div>
              <div className="mt-2 pt-1 border-t flex items-center justify-center">
                <button type="button" className="material-symbols-outlined" onClick={handleConfirmBeginDate}>check</button>
                <div className="p-1 px-4"><Button click={resetBeginHour} label="Reset"/></div>
                <button type="button" className="material-symbols-outlined" onClick={cancelBeginDate}>close</button>
              </div>
            </div>
            :
            <Button click={() => setSelectingBeginHour(true)} label={dayjs(formData.begin).format("HH:mm")} otherCss="mb-4"/>
          }
        </div>}
        { !formData.isTask && <>
          <span className="mb-2">Finisce</span>
          { selectingEndDate ? <div className="flex flex-col mb-4">
              <div className="border-b mb-1 pb-2 flex flex-col items-center justify-center space-x-2">
                <div className="flex items-center mb-2 space-x-2">
                  <span>il </span>
                  <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`}
                          name="day" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).date()}>
                    { daysInMonthArray(dayjs(formData.end)).map(day => <option key={day} value={day}>{day}</option>) }
                  </select>
                  <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                          name="month" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).month()}>
                    { monthsArray.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                  </select>
                  <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                          name="year" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).year()}>
                    { yearsChoiceArray.map(year => <option key={year} value={year}>{year}</option>) }
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button type="button" className="material-symbols-outlined" onClick={() => handleConfirmEndDate("date")}>check</button>
                <div className="p-1 px-4"><Button click={() => resetEndDate("date")} label="Reset"/></div>
                <button type="button" className="material-symbols-outlined" onClick={() => cancelEndDate("date")}>close</button>
              </div>
            </div>
            :
            <Button click={() => setSelectingEndDate(true)} label={formattedEndDate} otherCss="mb-4"/>
          }
          { !allDay && <div className="flex flex-col items-center">
            <span className="mb-1">Alle</span>
            { selectingEndHour ? <div className="flex flex-col mb-4">
                <div className="border-b mb-1 pb-2 flex flex-col items-center justify-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <p> alle </p>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="hour" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).hour()}>
                      { hoursChoiceArray.map(hour => <option key={hour} value={parseInt(hour)}>{hour}</option>) }
                    </select>
                    <p>:</p>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="minute" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).minute()}>
                      { minutesChoiceArray.map(minute => <option key={minute} value={parseInt(minute)}>{minute}</option>) }
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button type="button" className="material-symbols-outlined" onClick={handleConfirmEndDate}>check</button>
                  <div className="p-1 px-4"><Button click={resetEndDate} label="Reset"/></div>
                  <button type="button" className="material-symbols-outlined" onClick={cancelEndDate}>close</button>
                </div>
              </div>
              :
              <Button click={() => setSelectingEndHour(true)} label={dayjs(formData.end).format("HH:mm")} otherCss="mb-4"/>
            }
          </div>}
        </>}
        { selectedEvent ? 
          <>
          <div className="my-4 p-2 flex flex-col max-w-[300px] border border-red-500 text-center">
            <p className="text-sm">Non puoi modificare le opzioni di ripetizione.</p>
            <div className="flex items-center justify-center space-x-4 mt-3">
              <div className="flex flex-col">
                <span className="text-sm">Crea un nuovo evento</span>
                <span className="text-sm">con lo stesso contenuto</span>
              </div>
              <button className="material-icons-outlined" type="button" onClick={() => setDuplicatedEvent(selectedEvent)}>content_copy</button>
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
                                    name="day" onChange={handleChangeEndsOn} defaultValue={dayjs(formData.repeatedData.endsOn).date()}>
                              { endsOnDaysChoiceArray.map(day => <option key={day} value={day}>{day}</option>) }
                            </select>
                          }
                          { showIfNotRepeatsEvery(["year"]) &&
                            <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                                    name="month" onChange={handleChangeEndsOn} defaultValue={dayjs(formData.repeatedData.endsOn).month()}>
                              { monthsArray.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                            </select>
                          }
                          <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                                  name="year" onChange={handleChangeEndsOn} defaultValue={dayjs(formData.repeatedData.endsOn).year()}>
                            { yearsChoiceArray.map(year => <option key={year} value={year}>{year}</option>) }
                          </select>
                        </div>
                        <div className="flex items-center justify-center">
                          <button type="button" className="material-symbols-outlined" onClick={handleConfirmEndsOn}>check</button>
                          <div className="p-1 px-4"><Button click={resetEndsOn} label="Reset"/></div>
                          <button type="button" className="material-symbols-outlined" onClick={cancelEndsOn}>close</button>
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
        <div className="w-full flex justify-center">
          <textarea style={{scrollbarWidth: "thin"}}
            className={`rounded p-2 my-3 mb-4 w-full min-h-[90px] text-center placeholder:text-white ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG}`}
            name="description" placeholder="Descrizione" value={formData.description} onChange={handleChange} />
        </div>
        <div className="flex items-center justify-center gap-x-2">
          {colors.labelsNames.map((label, i) => (
            <span key={i}
              onClick={() => handleChangeLabel(label)}
              tabIndex="0"
              onKeyPress={(e) => { if (e.key === ' ') handleChangeLabel(label) }}
              className={`${colors.labelsBackground[label]} w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}>
              { formData.label === label && <span className={`material-icons-outlined text-black text-base`}>check</span> }
            </span>
          ))}
        </div>
      </div>
    </div>
)
}

/*
        { !allDay && <div className="flex flex-col items-center">
          <span className="mb-1">{formData.isTask ? "Alle" : "Inizia alle"}</span>
          { selectingBeginHour ? <div className="flex flex-col items-center mb-4">
              <div className="flex items-center space-x-2">
                <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`}
                        name="hour" onChange={handleChangeBeginDate} defaultValue={dayjs(formData.begin).format("HH")}>
                  { hoursChoiceArray.map(hour => <option key={hour} value={parseInt(hour)}>{hour}</option>) }
                </select>
                <p>:</p>
                <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                        name="minute" onChange={handleChangeBeginDate} defaultValue={dayjs(formData.begin).format("mm")}>
                  { minutesChoiceArray.map(minute => <option key={minute} value={parseInt(minute)}>{minute}</option>) }
                </select>
              </div>
              <div className="mt-2 pt-1 border-t flex items-center justify-center">
                <button type="button" className="material-symbols-outlined" onClick={handleConfirmBeginDate}>check</button>
                <div className="p-1 px-4"><Button click={resetBeginHour} label="Reset"/></div>
                <button type="button" className="material-symbols-outlined" onClick={cancelBeginDate}>close</button>
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
                            name="day" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).date()}>
                      { daysInMonthArray(dayjs(formData.end)).map(day => <option key={day} value={day}>{day}</option>) }
                    </select>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="month" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).month()}>
                      { monthsArray.map(i => <option key={i} value={i}>{monthsNames[i]}</option>) }
                    </select>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="year" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).year()}>
                      { yearsChoiceArray.map(year => <option key={year} value={year}>{year}</option>) }
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p> alle </p>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="hour" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).hour()}>
                      { hoursChoiceArray.map(hour => <option key={hour} value={parseInt(hour)}>{hour}</option>) }
                    </select>
                    <p>:</p>
                    <select className={`appearance-none text-center px-2 py-1 rounded ${colors.BUTTON_BG}`} 
                            name="minute" onChange={handleChangeEndDate} defaultValue={dayjs(formData.end).minute()}>
                      { minutesChoiceArray.map(minute => <option key={minute} value={parseInt(minute)}>{minute}</option>) }
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <button type="button" className="material-symbols-outlined" onClick={handleConfirmEndDate}>check</button>
                  <div className="p-1 px-4"><Button click={resetEndDate} label="Reset"/></div>
                  <button type="button" className="material-symbols-outlined" onClick={cancelEndDate}>close</button>
                </div>
              </div>
              :
              <Button click={() => setSelectingEndDate(true)} label={formattedEndDate} otherCss="mb-4"/>
            }
          </>}
        </div>}
*/
