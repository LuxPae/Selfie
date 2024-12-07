import React, { useEffect, useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import EventsListEntry from "../components/EventsListEntry.js"
import Filters from "../components/Filters.js"
import ShowCalendarTypeComponent from "../components/ShowCalendarTypeComponent.js"
import * as colors from "../scripts/COLORS.js"

export default function EventsList({ events }) {

  var { selectedDay, showEventModal, setShowEventModal, setShowEventsList, setSelectedEvent, setIsCreatingNewEvent, shownCalendarType } = useContext(GlobalContext);

  const calendarTypeAsText = () => {
    if (shownCalendarType === "tutti") return "eventi o attività"
    else return shownCalendarType
  }

  const openModal = () => {
    setIsCreatingNewEvent(true)
    setShowEventModal(true)
    setSelectedEvent(null)
  }

  return (
    <>
    <div className="w-full h-full">
      <div className={`${colors.CALENDAR_BG_MEDIUM} rounded-lg`}>
        <header className={`border-b ${colors.CALENDAR_BG_MEDIUM}`}>
          <div className="pb-2 text-center items-center flex space-x-4 justify-between items-center mx-4 mt-2">
            <button type="button" onClick={openModal}
                    className={`h-12 w-12 material-symbols-outlined text-white text-4xl border-2 rounded-full hover:bg-white ${colors.INVERTED_HOVER_TEXT}`}
                    title="crea evento"> Add 
            </button>
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
        <div className="md:hidden border-b md:border-0 mt-2">
          <div className="flex flex-col justify-between">
            <div className="px-3 border-b">
              <ShowCalendarTypeComponent/>
            </div>
            <div className="h-7 mt-2 px-2">
              <Filters/>
            </div>
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
      </div>
    </div>
    </>
  )
}
