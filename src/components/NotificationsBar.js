import GlobalContext from "../context/GlobalContext.js"
import { useState, useEffect, useContext } from "react"
import { NOTIFICATION_EXPIRATION_TIME } from "../scripts/CONSTANTS.js"
import * as colors from "../scripts/COLORS.js"
      
export default function NotificationsBar()
{
  var { notify, currentNotification, setCurrentNotification, pendingNotifications, setPendingNotifications, showNotification, setShowNotification } = useContext(GlobalContext)

  const [hideNotifications, setHideNotifications] = useState(false)

  const showNextNotification = () => {
    setShowNotification(true)
    const new_pending_notifications = pendingNotifications.slice(1)
    setPendingNotifications(new_pending_notifications)
    const newNotification = new_pending_notifications[0]
    setCurrentNotification(newNotification)
  }

  const len = pendingNotifications.length
  useEffect(() => {
    var timer
    if (len === 0) {
      setCurrentNotification(null)
      setShowNotification(false)
    } else {
      if (!hideNotifications) setShowNotification(true)
      const newNotification = pendingNotifications[0]
      setCurrentNotification(newNotification)
      timer = setTimeout(showNextNotification, NOTIFICATION_EXPIRATION_TIME)
    }

    return () => clearInterval(timer)
  }, [notify])

  return (<>
    <div className={`${showNotification || "hidden"} w-full flex items-center justify-center border-b-2 rounded-b-xl bg-zinc-800 z-20`} onClick={() => { setShowNotification(false); setHideNotifications(true) }}>
      { currentNotification?.type === "error" && <span className="text-red-500">Errore: {currentNotification.message}</span>}
      { currentNotification?.type === "warning" && <span className="text-yellow-500">Attenzione: {currentNotification.message}</span>}
      { (currentNotification?.type !==  "error" && currentNotification?.type !== "warning") &&
        <span className="text-gray-300">{currentNotification?.type}{currentNotification?.type && ":"} {currentNotification?.message}</span>
      }
    </div>
  </>)
}  


// Copia del codice, perché questo funziona e non si sa mai

// così funziona, ma devo aspettare 1e3 prima che compaia una notifica, io invece voglio che la prima compaia subito
//const showNextNotification = () => {
//  if (pendingNotifications.length > 0) {
//    console.log("next notification")
//    const newNotification = pendingNotifications[0]
//    setCurrentNotification(newNotification)
//    const new_pending_notifications = pendingNotifications.slice(1)
//    setPendingNotifications(new_pending_notifications)
//  } else {
//    console.log("no notifications")
//    setCurrentNotification(null)
//  }
//}
//timer = setInterval(showNextNotification, 1e3) questa riga nello useEffect

//export default function NotificationsBar()
//{
//
//  const [count, setCount] = useState(0)
//
//  const [pendingNotifications, setPendingNotifications] = useState([])
//  
//  const [currentNotification, setCurrentNotification] = useState("")
//
//  const notify = (notification) => {
//    const new_pending_notifications = [...pendingNotifications, notification]
//    console.log("Added notification", notification)
//    console.log("New array", new_pending_notifications)
//    setPendingNotifications(new_pending_notifications)
//    setCount(count + 1)
//  }
//   
//  useEffect(() => {
//    const timer = setInterval(() => {
//      if (pendingNotifications.length > 0) {
//        console.log("arr:", pendingNotifications)
//        const newNotification = pendingNotifications[0]
//        setCurrentNotification(newNotification)
//        const new_pending_notifications = pendingNotifications.slice(1)
//        console.log("new array:", new_pending_notifications)
//        setPendingNotifications(new_pending_notifications)
//      } else setCurrentNotification("")
//    }, 1e3)
//
//    return () => clearInterval(timer)
//  }, [pendingNotifications])
//
//  const pendingNotificationsNumber = useMemo(() => pendingNotifications.length, [pendingNotifications])
//
//  return (
//   <div className="">
//     <button className="mb-4 border rounded px-1" onClick={() => notify("notification "+count)}>add</button>
//     <div>Count: {pendingNotificationsNumber}</div>
//     <div>Current notification: {currentNotification}</div>
//     <ul className="flex flex-col">Pending notifications: {pendingNotifications.map(e => <li key={e}>- {e}</li>)}</ul>
//   </div>
//  )
//}  
