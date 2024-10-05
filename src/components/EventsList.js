//TODO
// - se l'evento è ripetuto, nel cancellarlo si può scegliere se cancellare solo quello selezionato o tutti quelli ripetuti
import React, { useMemo, useEffect, useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
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

export default function EventsList() {

  var { savedEvents, dispatchEvent, selectedDay, showEventsList, showEventModal, setShowEventModal, setShowEventsList, setSelectedEvent } = useContext(GlobalContext);

  const [ showFilters, setShowFilters ] = useState(false)
  const [ filters, setFilters ] = useState({ white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true })


  const fakeEvent = {
    users: ["bsd4554lkdjfglkj"],
    title: "Uruk",
    description: "Evento rapito alla sua famiglia e forgiato in un evento fasullo, convinto di essere il più forte. Lorem ipsum dolor sic amet bla bla bla... sldfkjs lskjf lskjf slkjf slkdjflskjdlrbakj sdfòalkajsbòlkajs òdlfkjaslòkj lòsdjdfòlaksj  òsldkdjfòlajslòjks lòjb saalksjrvlòs jròlkajgslk rjbjls gjrlsjlòrkjasòlek lsejrh askjralskj narlkjselhr jlsk ralsejkrlesj",
    label: "white",
    date: dayjs().valueOf(),
    allDay: false,
    duration: 2.5,
    begin: dayjs().valueOf(),
    end: dayjs().valueOf(),
    repeated: false,

    createdAt: dayjs().valueOf(),
    updatedAt: dayjs().valueOf()
  }
  const fakeEventPiccolo = {
    users: ["bsd4554lkdjfglkj"],
    title: "Harfoot",
    description: "Creaturina piccina",
    date: dayjs().valueOf(),
    allDay: true,
    repeated: true,
    label: "white",

    createdAt: dayjs().valueOf(),
    updatedAt: dayjs().valueOf()
  }
  const fakeEventTitoloLungo = {
    users: ["bsd4554lkdjfglkj"],
    title: "AAAAAAAAAAAAAA slkjfslkejr laskjearlbajslgjr alsjrgaljlgrjal sjrlej",
    description: "Essere dalla faccia lunghissima",
    date: dayjs().valueOf(),
    label: "white",
    allDay: false,
    repeated: false,

    createdAt: dayjs().valueOf(),
    updatedAt: dayjs().valueOf()
  }

  const handleFiltersOff = () => {
    setShowFilters(false);
    setFilters({ white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true });
  }

  const allFilters = () => {
    for (let label of Object.keys(filters)) {
      if (!filters[label]) return false;
    }
    return true;
  }

  const todayEvents = savedEvents.filter((event, i) => dayjs(event.date).isSame(selectedDay, "day"));
  //console.log(todayEvents)
  const filterEvents = () => allFilters() ? todayEvents : todayEvents.filter((event, i) => filters[event.label])
  const  filteredEvents = useMemo(filterEvents, [filters, todayEvents, savedEvents, allFilters])

  useEffect(() => {
    //console.log("\nToday events:", todayEvents);
    //console.log("\nToday events labels:", todayEvents.map(e => e.label));
    
    dispatchEvent({ action: "CREATE", event: { ...fakeEventPiccolo, label: "green", _id: "palle" }});
    dispatchEvent({ action: "CREATE", event: { ...fakeEventPiccolo, label: "white", _id: "bolle" }});
    dispatchEvent({ action: "CREATE", event: { ...fakeEventPiccolo, label: "blue", _id: "sopra" }});
    dispatchEvent({ action: "CREATE", event: { ...fakeEventPiccolo, label: "red", _id: "ancestrale" }});
  }, [])

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
              {!showEventModal && <button
                  onClick={() => { setShowEventModal(true); setSelectedEvent(null) }}
                  className="h-12 w-12 material-symbols-outlined text-white text-4xl border-2 rounded-full hover:bg-white hover:text-green-700"
                  title="crea evento"
                > Add
                </button>
              }
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
                <span onClick={() => setShowFilters(true)} className="material-symbols-outlined">filter_alt</span>
                </>
                :
                <>
                <span className="mx-4 inline-flex space-x-4">
                  {labels.map((label, i) => (
                    <div key={i} className={`${!filters[label] ? labelsBG[label] : ""}`}>
                      <input
                        type="checkbox"
                        checked={filters[label]}
                        onChange={() => handleCheckboxChange(label)}
                        className={`w-6 h-6 ${labelsAccent[label]}`}
                      />
                    </div>
                    ))}
                </span>
                <span onClick={handleFiltersOff} className="material-symbols-outlined">filter_alt_off</span>
                </>
              }
            </div>
          </div>
          <div id="events_container" style={{scrollbarWidth: "thin"}} className="h-[400px] min-w-[500px] mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">
            { todayEvents.length > 0 ?
              <ul>
                { filteredEvents.map((e, i) => <li key={i}><EventsListEntry event={e}/></li>) }
              </ul>
              :
              <p className="flex justify-center self-center text-xl mt-4">Non ci sono eventi per oggi.</p>
            }
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
