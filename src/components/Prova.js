import React from "react"
import NotificationsBar from "../components/NotificationsBar.js"
import GlobalContext from "../context/GlobalContext.js"
import { validateRegistration } from "../scripts/userValidators.js"

export default function Prova()
{
  const { } = React.useContext(GlobalContext)

  const [formData, setFormData] = React.useState({
    email:"",
    password:"",
    fullName:"",
    username:""
  })
  const error = validateRegistration(formData)
  if (error) console.log(formData, error)
  else console.log(formData+" valido")

  return (
  <>
  <div className="text-xl w-fit m-4 p-2 flex flex-col bg-purple-900 space-y-2">
    <label>
      email:
      <input className="ml-2 px-2" type="textarea" onChange={(e) => setFormData({...formData, email:e.target.value})} defaultValue={formData.email}/>
    </label>
    <label>
      password:
      <input className="ml-2 px-2" type="textarea" onChange={(e) => setFormData({...formData, password:e.target.value})} defaultValue={formData.password}/>
    </label>
    <label>
      fullName:
      <input className="ml-2 px-2" type="textarea" onChange={(e) => setFormData({...formData, fullName:e.target.value})} defaultValue={formData.fullName}/>
    </label>
    <label>
      username:
      <input className="ml-2 px-2" type="textarea" onChange={(e) => setFormData({...formData, username:e.target.value})} defaultValue={formData.username}/>
    </label>
  </div>
  <div className="border w-fit m-4 p-2"> {error || "Registrazione valida"} </div>
  </>
  )
}
