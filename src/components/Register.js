import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { validateRegistration } from "../scripts/userValidators.js"
import GlobalContext from "../context/GlobalContext.js"
import Button from "../components/Button.js"
import * as colors from "../scripts/COLORS.js"
import { TOKEN_EXPIRATION } from "../scripts/CONSTANTS.js"
import axios from "axios"
import dayjs from "dayjs"

export default function Register()
{
  const { user, dispatchUser } = useContext(GlobalContext)
  const navigate = useNavigate()

  const [error, setError] = useState("")

  useEffect(() => {
    if (user) navigate("/home")
  }, [user])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: ""
  })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async () => {
    const new_error = validateRegistration(formData)
    setError(new_error)
    if (new_error) return

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        { ...formData },
        { headers: { "Content-Type": "application/json" } }
      )
      localStorage.setItem("user", JSON.stringify({ ...response.data }))

      const expiration_date = dayjs().add(TOKEN_EXPIRATION, "hour")
      localStorage.setItem("tokenExpiration", expiration_date)

      dispatchUser({ type: "REGISTER", payload: response.data })
      navigate("/home")
    } catch (error) {
      localStorage.removeItem("user")
      if (error.message === "Network Error") setError("Errore nel Server")
      else setError(error.response.data.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="p-6 rounded w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center">Registrazione Utente</h2>
        { error && <p className={`text-center p-1 mt-10 mb-4 flex border ${colors.MAIN_BORDER_LIGHT} justify-center -translate-y-3 ${colors.MAIN_TEXT_LIGHT} ${colors.CALENDAR_BG_DARK}`}>{error}</p> }
        <form onKeyPress={(e) => {if (e.key === "Enter") handleSubmit()}}>
          <div className="mb-4">
            <label className={`${colors.MAIN_TEXT_LIGHT}`}>Email {!formData.email && '*'}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="nome@compagnia.com"
              onChange={handleChange}
              className={`w-full p-2 border ${colors.MAIN_BORDER_LIGHT} rounded mt-1`}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4">
            <label className={`${colors.MAIN_TEXT_LIGHT}`}>Password {!formData.password && '*'}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="********"
              onChange={handleChange}
              className={`w-full p-2 border ${colors.MAIN_BORDER_LIGHT} rounded mt-1`}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="mb-4">
            <label className={`${colors.MAIN_TEXT_LIGHT}`}>Nome Completo</label>
            <input
              type="textarea"
              name="fullName"
              value={formData.fullName}
              placeholder="Nome Cognome"
              onChange={handleChange}
              className={`w-full p-2 border ${colors.MAIN_BORDER_LIGHT} rounded mt-1`}
            />
          </div>
          <div className="mb-6">
            <label className={`${colors.MAIN_TEXT_LIGHT}`}>Nome Utente {!formData.username && '*'}</label>
            <input
              type="textarea"
              name="username"
              value={formData.username}
              placeholder="nome utente"
              onChange={handleChange}
              className={`w-full p-2 border ${colors.MAIN_BORDER_LIGHT} rounded mt-1`}
              required
            />
          </div>
          <Button click={handleSubmit} label="Registrati" otherCss="w-full py-2"/>
        </form>
        <div className="flex flex-col items-center space-y-2 mt-4">
          <p className="mt-4 text-center">Hai già un account?</p>
          <Button label="Esegui l'accesso!" click={() => navigate("/login")}/>
        </div>
      </div>
    </div>
  )
}
