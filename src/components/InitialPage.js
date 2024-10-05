import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext.js"

export default function InitialPage()
{
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) navigate("/home")
  }, [user])

  return <>
  <div className="mt-16 flex space-x-10 items-center justify-center h-full min-h-fit">
    <h1 className="pt-12 pb-5 text-6xl mb-4 text-center leading-normal">Benvenuto<br/>in<br/>Selfie</h1>
    <img src="https://img.freepik.com/premium-photo/sloth-touches-camera-taking-selfie-funny-selfie-portrait-animal_323015-1968.jpg?w=360" style={{maxHeight: "600px"}} className="rounded" alt="Selfie logo" />
    <h2 className="my-40 screen text-center text-3xl leading-normal">
      Esegui<br/>l'<Link to="/login" className="text-blue-500">accesso</Link> o <Link to="/register" className="text-blue-500">registrati</Link><br/>per continuare
    </h2>
  </div>
  </>
}
