import { useEffect, useContext } from "react"
import GlobalContext from "../context/GlobalContext.js"
import dayjs from "dayjs"

export default function useCheckForUser()
{
  const { dispatchUser, notify, setAllEvents } = useContext(GlobalContext)

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("tokenExpiration")
    const remaining_time = (dayjs(tokenExpiration).valueOf() - dayjs().valueOf()) / 1000*60*60
    const tokenIsExpired = remaining_time <= 0;
    if (tokenIsExpired) {
      notify([{type:"warning", message:"sessione scaduta, verrai reidirizzato alla pagina principale tra pochi secondi"}])
      setTimeout(() => {
        localStorage.removeItem("user")
        localStorage.removeItem("tokenExpiration")
        dispatchUser({ type: "LOGOUT" })
        setAllEvents([])
      }, 5000)
      return;
    }

    const ls_user_json = localStorage.getItem("user");
    if (ls_user_json) {
      const ls_user = JSON.parse(ls_user_json);
      dispatchUser({ type: "SET", payload: ls_user });
    } else {
      notify([{type:"error", message:"utente non trovato, ci scusiamo per il disagio"}])
      setTimeout(() => {
        localStorage.removeItem("user")
        localStorage.removeItem("tokenExpiration")
        dispatchUser({ type: "LOGOUT" })
        setAllEvents([])
      }, 5000)
    }
  }, [])
}
