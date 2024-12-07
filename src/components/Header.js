import GlobalContext from "../context/GlobalContext.js"
import { useContext } from "react"
import useCheckForUser from "../hooks/useCheckForUser.js"
import { useNavigate, Link, useLocation } from "react-router-dom"
import NotificationsBar from "../components/NotificationsBar.js"
import * as colors from "../scripts/COLORS.js"

export default function Header() {

  useCheckForUser()

  const navigate = useNavigate()
  const location = useLocation()
   
  var { user, showNotification } = useContext(GlobalContext) 

  const nav_link_css = (path) => {
    let css = " py-1 px-3 text-center "
    css += " font-semibold text-base border rounded"
    css += ` ${colors.MAIN_HOVER_TEXT} ${location.pathname === path ? "bg-pink-400 text-black" : "text-white"}`
    return css
  }

  const links = [
    { path: "/calendar", name: "Calendario" },
    { path: "/notes", name: "Note" },
    { path: "/pomodoro", name: "Pomodoro" }
  ]

  return (
    <>
    <div className="relative mb-[120px] md:mb-[70px]">
      <div className="flex flex-col">
        <nav className={`z-10 px-4 flex w-screen justify-between fixed top-0 left-0 right-0 ${showNotification ? "border-b" : "border-b-2 md:rounded-b-xl"} bg-zinc-800`}>
          <Link to="/home" className={`flex self-center text-3xl px-1 font-semibold ${colors.MAIN_HOVER_TEXT} 
                                       ${location.pathname === "/home" ? "bg-pink-400 text-black h-fit rounded" : "text-white"}`}>
            Selfie
          </Link>
          <div className={`flex space-x-4 px-2 ${colors.MAIN_BORDER_LIGHT}`}>
            <div className={`flex justify-around absolute top-full left-0 md:static w-full`}>
              <div className={`border-t-2 flex w-full bg-zinc-800 py-2 md:border-0 justify-between px-4 md:space-x-8 items-center font-medium border-b-2 ${!showNotification && "rounded-b-lg"} ${colors.MAIN_BORDER_LIGHT}`}>
                { links.map(L => <Link to={L.path} key={L.name} className={nav_link_css(L.path)}>{L.name}</Link>)}
              </div>
            </div>
          </div>
          <img src={user?.picture || "https://img.freepik.com/premium-photo/sloth-touches-camera-taking-selfie-funny-selfie-portrait-animal_323015-1968.jpg?w=360"}
               className={`self-center rounded-full h-12 bg-gray-50 ${location.pathname === "/profile" ? "border-4 rounded-full border-pink-400" : "border-0"}`} alt="Selfie logo" onClick={() => navigate("/profile")}/>
        </nav>
        <div className="fixed top-[100px] md:top-[50px] w-full">
          <NotificationsBar/>
        </div>
      </div>
    </div>
    </>
  )
}
