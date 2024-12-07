import GlobalContext from "../context/GlobalContext.js"
import { useContext } from "react"

export default function ShowCalendarTypeComp()
{
  var { showCompletedTasks, setShowCompletedTasks, shownCalendarType, setShownCalendarType } = useContext(GlobalContext)

  const handleChangeCalendarType = (e) => {
    setShownCalendarType(e.target.value);
  }

  return (
  <div className="pb-2 flex items-center space-x-2">
    <select className="appearance-none text-center px-2 rounded py-1" defaultValue={shownCalendarType} onChange={handleChangeCalendarType}>
      <option value="tutti">Tutti</option>
      <option value="eventi">Eventi</option>
      <option value="attività">Attività</option>
    </select>
    { shownCalendarType !== "eventi" && <div className="flex items-center">
      <span className="mr-2">Mostra attività completate</span>
      <input className="w-5 h-5" type="checkbox" value={showCompletedTasks} onChange={(e) => setShowCompletedTasks(e.target.checked)}/>
    </div>}
  </div>
  )
}

