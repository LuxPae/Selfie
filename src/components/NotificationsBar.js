//[TODO]
// rendere globali notify, pendingNotifications e currentNotification

import GlobalContext from "../context/GlobalContext.js"
import { useState, useEffect, useContext } from "react"
import { NOTIFICATION_EXPIRATION_TIME } from "../scripts/CONSTANTS.js"

function IAddNotifications({ nome_prova })
{
  var { notify } = useContext(GlobalContext)

  const createNotification = () => {
    notify(nome_prova, "notifica")
  }

  return (
    <button className="mb-4 border rounded px-1" onClick={createNotification}>notifica {nome_prova}</button>
  )
}
      
export default function NotificationsBar()
{
  var { currentNotification, setCurrentNotification, pendingNotifications, setPendingNotifications } = useContext(GlobalContext)

  const showNextNotification = () => {
    const new_pending_notifications = pendingNotifications.slice(1)
    setPendingNotifications(new_pending_notifications)
    const newNotification = new_pending_notifications[0]
    setCurrentNotification(newNotification)
  }

  const len = pendingNotifications.length
  var timer
  useEffect(() => {
    if (len === 0) setCurrentNotification(null)
    else if (len > 1) timer = setInterval(showNextNotification, NOTIFICATION_EXPIRATION_TIME)
    else {
      const newNotification = pendingNotifications[0]
      setCurrentNotification(newNotification)
      timer = setTimeout(showNextNotification, NOTIFICATION_EXPIRATION_TIME)
    }

    return () => clearInterval(timer)
  }, [pendingNotifications])

  const formatNotification = (notification) => `${notification.type} -> ${notification.message}`

  return (
    <div>
      <IAddNotifications nome_prova="prova 1"/>
      <IAddNotifications nome_prova="calendario "/>
      <IAddNotifications nome_prova="errore"/>
      <div>Notifica corrente: {currentNotification ? (currentNotification.type+" - "+currentNotification.message) : "nessuna"}</div>
      <div>Coda di notifiche:</div>
      { len > 0 ? <ol>{ pendingNotifications.map(n => <li>- {formatNotification(n)}</li>)}</ol> 
        : <div>ø</div>
      }
    </div>
  )
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
