import React, { useEffect, useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import EventsListEntry from "../components/EventsListEntry.js"
import dayjs from "dayjs"

export default function EventsList() {

  var { savedEvents, dispatchCalEvent, selectedDay, showEventsList, showEventModal, setShowEventModal, setShowEventsList } = useContext(GlobalContext);

  const fakeEvent = {
    users: ["bsd4554lkdjfglkj"],
    _id: "345p4etlesdkjg234l5je£$%Edfglkj",
    title: "Uruk",
    description: "Evento rapito alla sua famiglia e forgiato in un evento fasullo, convinto di essere il più forte. Lorem ipsum dolor sic amet bla bla bla... sldfkjs lskjf lskjf slkjf slkdjflskjdlrbakj sdfòalkajsbòlkajs òdlfkjaslòkj lòsdjdfòlaksj  òsldkdjfòlajslòjks lòjb saalksjrvlòs jròlkajgslk rjbjls gjrlsjlòrkjasòlek lsejrh askjralskj narlkjselhr jlsk ralsejkrlesj",
    date: dayjs().valueOf(),
    all_day: false,
    duration: 2.5,
    begin: dayjs().valueOf(),
    end: dayjs().valueOf(),
    repeated: false,

    createdAt: dayjs().valueOf(),
    updatedAt: dayjs().valueOf()
  }
  const fakeEventPiccolo = {
    users: ["bsd4554lkdjfglkj"],
    _id: "345p4etlesdkjg234l5je£$%Edfglkj",
    title: "Harfoot",
    description: "Creaturina piccina",
    date: dayjs().valueOf(),
    all_day: true,
    repeated: true,

    createdAt: dayjs().valueOf(),
    updatedAt: dayjs().valueOf()
  }

  const todayEvents = [
    {...fakeEvent, label: "red"},
    {...fakeEvent, label: "orange"},
    {...fakeEvent, label: "yellow"},
    {...fakeEvent, label: "green"},
    {...fakeEvent, label: "cyan"},
    {...fakeEvent, label: "blue"},
    fakeEvent,
    fakeEventPiccolo
  ]; 
  //todayEvents = savedEvents.filter(e => e.due_date === selectedDay);
  //dispatchCalEvent({action: "create", event_to_dispatch: fakeEvent});

  useEffect(() => {
    console.log("Events list for:", selectedDay.valueOf());
    console.log(todayEvents);
  }, [])

  return (
    <>
    <div className="w-full h-full mt-8">
      <div className="flex justify-right items-right">
        <form className="bg-green-900 rounded-lg">
          <header className="border-b pb-2 text-center items-center flex space-x-4 justify-between items-center bg-green-900 mx-4 mt-2">
            {!showEventModal && <button
                onClick={() => setShowEventModal(true)}
                className="h-12 w-12 material-symbols-outlined text-white text-4xl border-2 rounded-full hover:bg-white hover:text-green-700"
                title="crea evento"
              > Add
              </button>
            }
            <p className="text-xl"><span className="">{selectedDay.format("dddd D MMMM YYYY")}</span></p>
            <button
              onClick={() => {setShowEventsList(false); setShowEventModal(false)}}
              className="material-symbols-outlined text-white rounded text-3xl"
              title="chiudi"
            >
              Close
            </button>
          </header>
          <div className="border-b">
            i filtri per label (e per altro?) TODO {/* TODO */}
          </div>
          <div id="events_container" style={{"scrollbarWidth": "thin", "maxHeight": "400px"}} className="mr-3 overflow-auto snap-y ml-4 mt-4 mb-8">
            {/* TODO era carino <ul className="text-xl" style={{"list-style-type": "'↦ '"}}>*/}
            <ul>
              { todayEvents.map((e, i) => <li key={i}><EventsListEntry event={e}/></li>) }
            </ul>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
