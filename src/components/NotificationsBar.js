//[TODO]
// bene, ora lo devo fare con le notifiche, provo prima a spostare tutto qui e poi lo integro con tutto il resto, non dovrebbe essere un problema

import { useState, useEffect } from "react"
      
export default function NotificationsBar()
{
  const [count, setCount] = useState(0)

  const [arr, setArr] = useState([])
  
  const [extracted, setExtracted] = useState(0)

  const handleAdd = () => {
    const new_arr = [count, ...arr]
    setCount(count + 1)
    setArr(new_arr)
  }
   
  useEffect(() => {
    const timer = setInterval(() => {
      if (arr.length > 0) {
        console.log("arr:",arr)
        const last_index = arr.length-1
        const n = arr[last_index]
        setExtracted(n)
        const new_arr = arr.slice(0, last_index)
        console.log("new array:", new_arr)
        setArr(new_arr)
      }
    }, 1e3)

    return () => clearInterval(timer)
  }, [count, arr])

  return (
   <div className="border p-1">
     <button className="border" onClick={handleAdd}>add</button>
     <div>count: {count}</div>
     <div>extracted: {extracted}</div>
     <ul className="flex">numbers: {arr.map(e => <li key={e}>{e}</li>)}</ul>
   </div>
  )
}  
