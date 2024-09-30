import GlobalContext from "../context/GlobalContext.js"
import { useState, useEffect, useContext } from "react"
import { logout, getAuthToken } from "../scripts/authentication.js"
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import dayjs from "dayjs"

export default function Header() {

  const navigate = useNavigate();
  var { user } = useContext(GlobalContext);

  const [dropped, setDropped ] = useState(false);

  const DropDown = () => {
    setDropped(!dropped)
  }

  const li_css = () => {
    let css = "block py-2 px-3 "
    css += "text-gray-900 dark:text-white "
    css += "transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-green-400 dark:hover:text-white "
    return css;
  }

  return (
    <>
    {/* TODO renderla responsive, dropdown */}
    <nav className="bg-transparent border-gray-200">
      <div className="max-w-fit flex space-x-4 justify-items-start justify-start px-2 border rounded border-gray-600">
      <Link to="/" className="flex items-start space-x-3">
          <img src="https://img.freepik.com/premium-photo/sloth-touches-camera-taking-selfie-funny-selfie-portrait-animal_323015-1968.jpg?w=360" className="rounded-full w-6 h-8" alt="Selfie logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:hover:text-green-400 dark:text-white">Selfie</span>
      </Link>
      <div className="border-l border-gray-600 items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
        <ul className="ml-4 flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li> <Link to="/calendar" className={li_css()}>Calendario</Link> </li>
          <li> <Link to="/notes" className={li_css()}>Note</Link> </li>
          <li> <Link to="/pomodoro" className={li_css()}>Pomodoro</Link> </li>
          <li> <Link to="/profile" className={li_css()}>Profilo</Link> </li>
        </ul>
      </div>
      </div>
    </nav>
    </>
  )
}
