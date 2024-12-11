import { useEffect, useContext } from "react"
import ProfilePicture from "../components/ProfilePicture.js"
import GlobalContext from "../context/GlobalContext.js"
import dayjs from "dayjs"
import * as colors from "../scripts/COLORS.js"

export default function ProfilePreview({ user, modifying }) {

  var { allEvents, currentDate } = useContext(GlobalContext)

  return (
    <>
    <div className="flex justify-center items-center min-h-80">
      <div className={`${colors.MAIN_BG_MEDIUM} p-6 rounded-lg w-full max-w-sm`}>
        <div className="flex items-center space-x-4">
          <div className="flex">
            <ProfilePicture 
            picture={user.picture}
            alt="Profile picture"
            />
            <div className="p-2">
              <h2 className="text-xl font-semibold">Ciao, sono<br/><span className="text-green-600"> {user.fullName}</span>!</h2>
              <p className={`mt-2 ${colors.MAIN_TEXT_MEDIUM}`}>anche conosciuto come: <span className={`${colors.MAIN_TEXT_LIGHT}`}>{user.username}</span></p>
              <p className={`pt-2 ${colors.MAIN_TEXT_LIGHT}`}>{user.email}</p>
            </div>
          </div>
        </div>
        <div className={`mt-4 ${!modifying && "border-b"}`}>
          <h3 className="text-lg font-medium">{user.bio}</h3>
        </div>
        { !modifying && <div className="mt-2">
          <div className="font-semibold text-lg">Info Calendario:</div>
          <ul className="border-b pl-4 mb-2 list-disc">
            <li>Voci nel Calendario: {allEvents.length}</li>
            <li>Eventi: {allEvents.filter(e => !e.isTask).length} (passati: {allEvents.filter(e => !e.isTask && dayjs(e.end).isBefore(currentDate)).length})</li>
            <li>Attività: {allEvents.filter(e => e.isTask).length} (completate: {allEvents.filter(e => e.isTask && e.isTask.completed).length})</li>
          </ul>
          <div className="font-semibold text-lg">Info Note:</div>
          <ul className="border-b pl-4 mb-2 list-disc">
            <li>Note totali: TODO</li>
          </ul>
          <div className="font-semibold text-lg">Info Pomodoro:</div>
          <ul className="pl-4 list-disc">
            <li>Pomodori totali: TODO</li>
          </ul>
        </div>}
      </div>
    </div>
    </>
  )
}
