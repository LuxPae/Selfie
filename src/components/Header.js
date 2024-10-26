import GlobalContext from "../context/GlobalContext.js"
import { useState, useEffect, useContext } from "react"
import useCheckForUser from "../hooks/useCheckForUser.js"
import { useNavigate, Link } from "react-router-dom";
import NotificationsBar from "../components/NotificationsBar.js"
import * as colors from "../scripts/COLORS.js"

//TODO la notifica non funziona benissimo, il timer si sfancula un po' (nel video dei tips & tricks sistemava questa cosa)
export default function Header() {

  useCheckForUser();

  const navigate = useNavigate();
  var { user, currentNotification, showNotification, pendingNotifications, setPendingNotifications, setCurrentNotification, setShowNotification, notify } = useContext(GlobalContext); 

  const [dropped, setDropped ] = useState(false);

  const DropDown = () => {
    setDropped(!dropped)
  }

  const li_css = () => {
    let css = "block py-2 px-3 "
    css += "text-white "
    css += `transparent md:p-0 ${colors.MAIN_HOVER_TEXT}`
    return css;
  }

  const N = 5
  //TODO togli
  useEffect(() => {
    if (pendingNotifications.length > N) return
    else {
      for (let i = 0; i < N; i++) {
        notify("error", "prova "+1)
      }
    }
  }, [])


  //const [timer, setTimer] = useState(0)

  //const checkForNotificationsToDisplay = () => {
  //  if (pendingNotifications.length > 0 && !timer) return pendingNotifications
  //  else return []
  //}

  //useEffect(() => console.log("How many notifications?", pendingNotifications.length), [pendingNotifications])

  //useEffect(() => {
  //  const notifications = checkForNotificationsToDisplay()
  //  const notification = notifications[notifications.length-1]
  //  setCurrentNotification(notification);
  //  console.log("currentNotification", currentNotification)
  //  setShowNotification(true);
  //  const t = setTimeout(() => {
  //    setCurrentNotification(null)
  //    setTimer(0)
  //    setShowNotification(false)
  //  }, 5000)
  //  setTimer(t)
  //  console.log("timer:", t)
  //}, [notify])

  return (
    <>
    {/* TODO renderla responsive, no dropdown, ma flex fatto bene */}
    <nav className="flex justify-center">
      <div className={`max-w-fit flex space-x-4 justify-items-start justify-start px-2 border rounded ${colors.MAIN_BORDER_LIGHT}`}>
        <Link to="/home" className="flex items-start space-x-3">
            <img src={user?.picture || "https://img.freepik.com/premium-photo/sloth-touches-camera-taking-selfie-funny-selfie-portrait-animal_323015-1968.jpg?w=360"} className="rounded-full h-8 bg-gray-50" alt="Selfie logo" />
            <span className={`self-center text-2xl font-semibold whitespace-nowrap ${colors.MAIN_HOVER_TEXT} text-white`}>Selfie</span>
        </Link>
        <div className={`border-l ${colors.MAIN_BORDER_LIGHT} items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user`}>
          <ul className={`ml-4 flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 md:flex-row md:mt-0 ${colors.MAIN_BORDER_LIGHT}`}>
            <li> <Link to="/calendar" className={li_css()}>Calendario</Link> </li>
            <li> <Link to="/notes" className={li_css()}>Note</Link> </li>
            <li> <Link to="/pomodoro" className={li_css()}>Pomodoro</Link> </li>
            <li> <Link to="/profile" className={li_css()}>Profilo</Link> </li>
            <li className={`${showNotification || "hidden"} flex items-center`}>
              { /* TODO  togli errore, attenzione e messaggio qua a destra*/}
              { currentNotification?.type === "error" && <span className="text-red-500">Errore: {currentNotification?.message || "errore"}</span>}
              { currentNotification?.type === "warning" && <span className="text-yellow-500">Attenzione: {currentNotification?.message || "attenzione"}</span>}
              { (currentNotification?.type !==  "error" && currentNotification?.type !== "warning") && 
                <span className={`${colors.MAIN_TEXT_MEDIUM}`}>{currentNotification?.type}{currentNotification?.type && ":"} {currentNotification?.message || "messaggio"}</span>
              }
            </li>
          </ul>
        </div>
      </div>
      <NotificationsBar />
    </nav>
    </>
  )
}
