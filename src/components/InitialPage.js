import { useEffect } from "react"
import { isAuthenticated } from "../scripts/authentication.js"
import { useNavigate, Link } from "react-router-dom"

export default function InitialPage()
{
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) navigate("/home")
  }, [])

  return <>
  <div className="flex flex-col items-center justify-center h-full min-h-fit">
    <h1 className="pt-12 pb-5 text-5xl mb-4">Benvenuto in Selfie</h1>
    <p className="my-40 screen px-12 text-3xl">Esegui l'<Link to="/login" className="text-blue-500">accesso</Link> o <Link to="/register" className="text-blue-500">registrati</Link> per continuare.</p>
  </div>
  </>
}
