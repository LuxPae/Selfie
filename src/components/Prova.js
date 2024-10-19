import React from "react"
import dayjs from "dayjs"

export default function Prova()
{
  const today = dayjs();
  const day = dayjs(today).add(1, "day");
  const week = dayjs(today).add(1, "week");
  const month = dayjs(today).add(1, "month");
  const year = dayjs(today).add(1, "year");

  const d1_b = dayjs(1729373314580)
  const d1_e = dayjs(1729363440000) 
  const d2_b = dayjs(1729459714580) 
  const d2_e = dayjs(1729449840000) 
  const d3_b = dayjs(1729546114580) 
  const d3_e = dayjs(1729536240000) 

  return (
  <div className="p-4">
    <p className="text-4xl mb-4">Today: {today.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">1 Day: {day.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">1 Week: {week.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">1 Month: {month.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">1 Year: {year.format("dddd DD-MM-YYYY HH:mm")}</p>
    <div className="mx-4"></div>
    <p className="text-4xl mb-4">d1_b: {d1_b.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">d1_e: {d1_e.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">d2_b: {d2_b.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">d2_e: {d2_e.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">d3_b: {d3_b.format("dddd DD-MM-YYYY HH:mm")}</p>
    <p className="text-4xl mb-4">d3_e: {d3_e.format("dddd DD-MM-YYYY HH:mm")}</p>
  </div>
  )
}
