//TODO
// - se l'evento è ripetuto, nel cancellarlo si può scegliere se cancellare solo quello selezionato o tutti quelli ripetuti
// - sistemare come vengono mostrati nella lista gli eventi (con tutte le informazioni)
import React, { useMemo, useEffect, useContext, useState } from "react";
import { getAllEvents } from "../API/events.js"
import GlobalContext from "../context/GlobalContext";
import { useAuthContext } from "../hooks/useAuthContext.js"
import EventsListEntry from "../components/EventsListEntry.js"
import dayjs from "dayjs"

const labels = ["white", "red", "orange", "yellow", "green", "cyan", "blue"]
const labelsAccent = {
  white: "accent-white",
  red: "accent-red-600",
  orange: "accent-orange-500",
  yellow: "accent-yellow-400",
  green: "accent-green-500",
  cyan: "accent-cyan-400",
  blue: "accent-blue-600"
}
const labelsBG = {
  white: "bg-white",
  red: "bg-red-600",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  cyan: "bg-cyan-400",
  blue: "bg-blue-600"
}

export default function EventsList({ sendFilteredEvents }) {

  var { allEvents, dispatchEvent, selectedDay, showEventsList, showEventModal, setShowEventModal, setShowEventsList, setSelectedEvent } = useContext(GlobalContext);
  var { user } = useAuthContext();

  const  todayEvents = useMemo(() => allEvents.filter(e => selectedDay.date() === dayjs(e.date).date()), [selectedDay, allEvents, dispatchEvent]);

  const [ showFilters, setShowFilters ] = useState(false)
  const [ filters, setFilters ] = useState({ white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true })

  const [loading, setLoading] = useState(true);

  const allFilters = () => {
    for (let label of Object.keys(filters)) {
      if (!filters[label]) return false;
    }
    return true;
  }

  const filterAllEvents = () => allFilters() ? allEvents : allEvents.filter((event, i) => filters[event.label]);
  const [allFilteredEvents, setAllFilteredEvents] = useState(filterAllEvents());

  useEffect(() => {
    const newAllFillteredEvents = filterAllEvents();
    setAllFilteredEvents(newAllFillteredEvents);
    sendFilteredEvents(newAllFillteredEvents);
    return () => sendFilteredEvents(allEvents);
  }, [filters, allEvents, showFilters])

  useEffect(() => {
    if (allEvents.length > 0) setLoading(false);
  }, [allEvents])

  const handleFiltersOff = () => {
    setShowFilters(false);
    const resetted_filters = { white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true };
    setFilters(resetted_filters);
  }
  
  const handleClearFilters = () => {
    const cleared_filters = { white: false, red: false, orange: false, yellow: false, green: false, cyan: false, blue: false };
    setFilters(cleared_filters);
  }

  const filterEvents = () => allFilters() ? todayEvents : todayEvents.filter((event, i) => filters[event.label])
  const  filteredEvents = useMemo(filterEvents, [filters, todayEvents, allFilters])

  const handleCheckboxChange = (filter_label) => {
    var updated_filters = {}
    for (let label of Object.keys(filters)) {
      updated_filters[label] = filter_label === label ? !filters[label] : filters[label]
    }
    setFilters(updated_filters)
  }

  return (
    <>
    <div className="w-full h-full mt-8">
      <div className="flex justify-right items-right">
        <form className="bg-green-900 rounded-lg">
          <header className="border-b bg-green-900">
            <div className="pb-2 text-center items-center flex space-x-4 justify-between items-center mx-4 mt-2">
              { !showEventModal && <button
                onClick={() => { setShowEventModal(true); setSelectedEvent(null) }}
                className="h-12 w-12 material-symbols-outlined text-white text-4xl border-2 rounded-full hover:bg-white hover:text-green-700"
                title="crea evento"
              > Add
              </button>}
              <p className="text-xl">{selectedDay.format("dddd D MMMM YYYY")}</p>
              <button
                onClick={() => {setShowEventsList(false); setShowEventModal(false)}}
                className="material-symbols-outlined text-white rounded text-3xl"
                title="chiudi"
              >
                Close
              </button>
            </div>
          </header>
          <div className="border-b flex justify-end">
            <div className="mt-2 mx-8">
              { !showFilters ?
                <>
                <span onClick={() => setShowFilters(true)} className="hover:cursor-pointer material-symbols-outlined">filter_alt</span>
                </>
                :
                <>
                <span title="togli tutti" className="hover:cursor-pointer material-symbols-outlined" onClick={handleClearFilters}>clear_all</span>
                <span className="mx-4 inline-flex space-x-4">
                  {labels.map((label, i) => (
                    <div key={i} className={`${!filters[label] ? labelsBG[label] : ""}`}>
                      <input
                        type="checkbox"
                        checked={filters[label]}
                        onChange={() => handleCheckboxChange(label)}
                        className={`w-6 h-6 ${labelsAccent[label]} hover:cursor-pointer`}
                      />
                    </div>
                    ))}
                </span>
                <span onClick={handleFiltersOff} className="hover:cursor-pointer material-symbols-outlined">filter_alt_off</span>
                </>
              }
            </div>
          </div>
          <div id="events_container" style={{scrollbarWidth: "thin"}} className="h-[400px] min-w-[500px] mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">
            { todayEvents.length > 0 ?
              <ul>
                { filteredEvents.sort((a,b) => dayjs(a.begin).valueOf()-dayjs(b.begin).valueOf()).map((e, i) => <li key={i}><EventsListEntry event={e}/></li>) }
              </ul>
              :
              <p className="flex justify-center self-center text-xl mt-4">{loading ? "Caricando gli eventi di oggi..." : "Non ci sono eventi per oggi."}</p>
            }
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
