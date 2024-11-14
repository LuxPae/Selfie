import React from "react"
import dayjs from "dayjs"

export default function Prova()
{
  const begin = dayjs()
  const end_today = begin.add(1, "hour")
  const end_after_today = begin.add(10, "day").add(1, "hour")

  const durata_in_giorni = end_after_today.diff(begin)/(1000*60*60*24)

  const more_than_one_day_dates = (begin, end) => {
    var dates = []
    var current
    var i = 0
    while (!begin.add(i, "day").isAfter(end)) {
      current = begin.add(i, "day")
      dates.push(current)
      i++
    }
    return dates
  }

  return (
  <div className="p-4">
    <p className="text-4xl">Inizio: {begin.format("dddd D MMMM YYYY HH:mm")}</p>
    <p className="text-4xl">Fine: {end_today.format("dddd D MMMM YYYY HH:mm")}</p>
    <p className="text-4xl">Stesso giorno?: {begin.startOf("day").isSame(end_today.startOf("day")) ? "Sì" : "No"}</p>

    <p className="my-4"></p>

    <p className="text-4xl">Inizio: {begin.format("dddd D MMMM YYYY HH:mm")}</p>
    <p className="text-4xl">Fine: {end_after_today.format("dddd D MMMM YYYY HH:mm")}</p>
    <p className="text-4xl">Stesso giorno?: {begin.startOf("day").isSame(end_after_today.startOf("day")) ? "Sì" : "No"}</p>
    <p className="text-4xl">Quanti giorni dura? {durata_in_giorni}</p>
    <div>
      {more_than_one_day_dates(begin, end_after_today).map((d, i) => <p className="text-xl">{d.format("D-MM-YYYY")}
          ({(() => {
            if (i === 0) return begin.format("HH:mm")
            else if (i === Math.floor(durata_in_giorni)) return end_after_today.format("HH:mm")
            else return "Tutto il giorno"
          })()})
        </p>)}
    </div>
  </div>
  )
}
