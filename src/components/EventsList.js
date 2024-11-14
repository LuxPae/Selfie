import React, { useMemo, useEffect, useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import EventsListEntry from "../components/EventsListEntry.js"
import { labelsNames, labelsAccent, labelsBackground } from "../scripts/COLORS.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"

export default function EventsList({ events }) {

  var { user, allEvents, selectedDay, showEventsList, showEventModal, setShowEventModal, setShowEventsList, setSelectedEvent, filters, setFilters, shownCalendarType, setShownCalendarType, showCompletedTasks, setShowCompletedTasks } = useContext(GlobalContext);

  const [ showFilters, setShowFilters ] = useState(false)

  const handleChangeCalendarType = (e) => {
    setShownCalendarType(e.target.value);
  }

  const allFilters = () => {
    for (let label of Object.keys(filters)) {
      if (!filters[label]) return false;
    }
    return true;
  }

  useEffect(() => {
   if (!allFilters()) setShowFilters(true) 
  }, [])

  const handleResetFilters = () => {
    setShowFilters(false);
    const resetted_filters = { white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true };
    setFilters(resetted_filters);
  }
  
  const handleClearFilters = () => {
    const cleared_filters = { white: false, red: false, orange: false, yellow: false, green: false, cyan: false, blue: false };
    setFilters(cleared_filters);
  }


  const handleCheckboxChange = (filter_label) => {
    var updated_filters = {}
    for (let label of Object.keys(filters)) {
      updated_filters[label] = filter_label === label ? !filters[label] : filters[label]
    }
    setFilters(updated_filters)
  }

  const calendarTypeAsText = () => {
    if (shownCalendarType === "tutti") return "eventi o attività"
    else return shownCalendarType
  }

  return (
    <>
    <div className="w-full min-w-sm h-full">
      <div className="flex justify-right items-right">
        <form className={`${colors.CALENDAR_BG_MEDIUM} rounded-lg`}>
          <header className={`border-b ${colors.CALENDAR_BG_MEDIUM}`}>
            <div className="pb-2 text-center items-center flex space-x-4 justify-between items-center mx-4 mt-2">
              { !showEventModal && <button
                onClick={() => { setShowEventModal(true); setSelectedEvent(null) }}
                className="h-12 w-12 material-symbols-outlined text-white text-4xl border-2 rounded-full hover:bg-white hover:text-green-700"
                title="crea evento"
              > Add
              </button>}
              <div className="flex flex-col">
                <p className={`${showEventModal ? "text-left" : "text-center"} text-xl`}>{selectedDay.format("dddd")}</p>
                <p className="text-xl">{selectedDay.format("D MMMM YYYY")}</p>
              </div>
              <button
                onClick={() => {setShowEventsList(false); setShowEventModal(false)}}
                className="material-symbols-outlined text-white rounded text-3xl"
                title="chiudi"
              >
                Close
              </button>
            </div>
          </header>
          <div className="border-b mt-2 flex flex-col justify-between">
            <div className="border-b px-2 pb-2 flex items-center space-x-2">
              <select className="appearance-none text-center px-2 rounded py-2" defaultValue={shownCalendarType} onChange={handleChangeCalendarType}>
                <option value="tutti">Mostra</option>
                <option value="tutti">Tutti</option>
                <option value="eventi">Eventi</option>
                <option value="attività">Attività</option>
              </select>
              { shownCalendarType !== "eventi" && <div className="flex items-center">
                <input className="w-4 h-4" type="checkbox" value={showCompletedTasks} onChange={(e) => setShowCompletedTasks(e.target.checked)}/>
                <span className="ml-2 ">Mostra attività completate</span>
              </div>}
            </div>
            <div className="mt-2 px-2">
              { !showFilters ?
                <span onClick={() => setShowFilters(true)} className="cursor-pointer material-symbols-outlined">filter_alt</span>
                :
                <>
                <span onClick={handleResetFilters} className="cursor-pointer material-symbols-outlined">filter_alt_off</span>
                <span className="mx-3 inline-flex space-x-2">
                  {labelsNames.map((label, i) => (
                    <div key={i} className={`${!filters[label] ? labelsBackground[label] : ""}`}>
                      <input
                        type="checkbox"
                        checked={filters[label]}
                        onChange={() => handleCheckboxChange(label)}
                        className={`w-5 h-5 ${labelsAccent[label]} cursor-pointer`}
                      />
                    </div>
                    ))}
                </span>
                <span title="togli tutti" className="cursor-pointer material-symbols-outlined" onClick={handleClearFilters}>clear_all</span>
                </>
              }
            </div>
          </div>
          <div id="events_container" style={{scrollbarWidth: "thin"}} className="h-[400px] max-w-full mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">
            { events.length > 0 ?
              <ul>
                { events.map((e, i) => <li key={i}><EventsListEntry event={e}/></li>) }
              </ul>
              :
              <>
              <p className="flex justify-center self-center text-xl mt-4">Non ci sono {calendarTypeAsText()} per oggi.</p>
              </>
            }
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
