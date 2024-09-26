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
    let elt = document.getElementById("user-dropdown");
    if (!dropped) {
      elt.classList.remove("hidden");
      elt.classList.add("block")
    }
    else {
      elt.classList.remove("block");
      elt.classList.add("hidden")
    }
    setDropped(!dropped)
  }

  return (
    <>
    {/* TODO come la fisso in alto? devo guardare il sito */}
    <nav className="fixed bg-transparent border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link to="/" className="flex items-center space-x-3">
          <img src="https://img.freepik.com/premium-photo/sloth-touches-camera-taking-selfie-funny-selfie-portrait-animal_323015-1968.jpg?w=360" className="h-8" alt="Selfie logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Selfie</span>
      </Link>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li> <Link to="/calendar" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Calendario</Link> </li>
          <li> <Link to="/notes" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Note</Link> </li>
          <li> <Link to="/pomodoro" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pomodoro</Link> </li>
          <li> <Link to="/profile" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Profilo</Link> </li>
        </ul>
      </div>
      </div>
    </nav>
    </>
  )
}
