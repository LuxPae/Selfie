import GlobalContext from "../context/GlobalContext.js"
import { useState, useEffect, useContext } from "react"
import useCheckForUser from "../hooks/useCheckForUser.js"
import { useNavigate, Link, useLocation } from "react-router-dom";
import NotificationsBar from "../components/NotificationsBar.js"
import * as colors from "../scripts/COLORS.js"

//[TODO]
// - la notifica non funziona benissimo, il timer si sfancula un po' (nel video dei tips & tricks sistemava questa cosa)
// - cambiare i colori
export default function Header() {

  useCheckForUser()

  const navigate = useNavigate()
  const location = useLocation()
   
  var { user, currentNotification, showNotification, pendingNotifications, setPendingNotifications, setCurrentNotification, setShowNotification, notify } = useContext(GlobalContext); 

  const nav_link_css = (path) => {
    let css = " py-1 px-3 text-center "
    css += " font-semibold text-base border rounded"
    css += ` ${colors.MAIN_HOVER_TEXT} ${location.pathname === path ? "bg-pink-400 text-black" : "text-white"}`
    return css;
  }

  const links = [
    { path: "/calendar", name: "Calendario" },
    { path: "/notes", name: "Note" },
    { path: "/pomodoro", name: "Pomodoro" }
  ]

  //TODO fixed o no?
  return (
    <>
    <nav className="flex px-4 justify-between _fixed_ sticky top-0 left-0 w-screen md:rounded-b-xl border-b-2 bg-zinc-800">
      <Link to="/home" className={`flex self-center text-3xl px-1 font-semibold whitespace-nowrap ${colors.MAIN_HOVER_TEXT} focus:text-orange-400
                                   ${location.pathname === "/home" ? "bg-pink-400 text-black h-fit rounded" : "text-white"}`}>
        Selfie
      </Link>
      <div className={`flex space-x-4 px-2 ${colors.MAIN_BORDER_LIGHT}`}>
        <div className={`flex justify-around w-full`}>
          <div className={`flex absolute w-full left-0 top-full border-b bg-zinc-800 py-2 md:border-0 md:static justify-evenly md:space-x-4 items-center font-medium rounded-b-lg ${colors.MAIN_BORDER_LIGHT}`}>
            { links.map(L => <Link to={L.path} key={L.name} className={nav_link_css(L.path)}>{L.name}</Link>)}
          </div>
        </div>
      </div>
      <img src={user?.picture || "https://img.freepik.com/premium-photo/sloth-touches-camera-taking-selfie-funny-selfie-portrait-animal_323015-1968.jpg?w=360"}
           className={`self-center rounded-full h-12 bg-gray-50 ${location.pathname === "/profile" ? "border-4 rounded-full border-pink-400" : "border-0"}`} alt="Selfie logo" onClick={() => navigate("/profile")}/>
      {/* TODO <NotificationsBar /> */}
      {/*<div className={`${showNotification || "hidden"} flex items-center`}>*/}
        { /* TODO  togli errore, attenzione e messaggio qua a destra*/}
      {/*  { currentNotification?.type === "error" && <span className="text-red-500">Errore: {currentNotification?.message || "errore"}</span>}*/}
      {/*  { currentNotification?.type === "warning" && <span className="text-yellow-500">Attenzione: {currentNotification?.message || "attenzione"}</span>}*/}
      {/*  { (currentNotification?.type !==  "error" && currentNotification?.type !== "warning") && */}
      {/*    <span className={`${colors.MAIN_TEXT_MEDIUM}`}>{currentNotification?.type}{currentNotification?.type && ":"} {currentNotification?.message || "messaggio"}</span>*/}
      {/*  }*/}
      {/*</div>*/}
    </nav>
    </>
  )
}
