import React from "react"
import { getProva } from "../API/prova.js"

export default function Prova() {

  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    getProva().then(data => setData(data));
  }, [])

  React.useEffect(() => {
    if (data) setLoading(false);
  }, [data])

  return <>
    <h1 className="text-4xl font-large text-green-600">Prova</h1>
    {!loading ? 
      <p className="text-white font-medium">{data.message}</p>
      :
      !error ?
        <p className="text-white font-medium">Caricamento...</p>
        : 
        <p className="text-red-600">{error}</p>
    }
  </>
}
