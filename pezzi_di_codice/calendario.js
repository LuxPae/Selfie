    <div className="grid grid-cols-7 gap-4">
      <div className={`${showEventModal ? "order-1 col-start-1 col-span-3" : "hidden"}`}>
        {showEventModal && <EventModal/>}
      </div>

    <div className={`order-2 max-w-3xl mx-full p-4 bg-green-950 rounded-lg ${!showEventModal && !showEventsList ? "col-start-3 col-span-5" : "col-start-4 col-span-3"}`}>
      <div className="flex justify-between items-center mb-5">
          <button onClick={goPrevMonth} className="w-10 text-5xl font-bold">‹</button>
          <h2 className="text-4xl font-bold">
              {MonthFormattedStringMMMM(currentDate)} {year}
          </h2>
          <button onClick={goNextMonth} className="w-10 text-5xl font-bold">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-lg text-center">
        {daysOfWeek.map((day, index) => (
            <div key={index} className="font-semibold">
                {day}
            </div>
        ))}
        {days.map((day_date, index) => (
            <div
                key={index}
                tabIndex="0"
                style={{height: day_tile_height()}}
                className={
                  `h-16 flex items-left justify-left pl-2 pt-1 rounded-lg focus:border-white hover:border-white focus:border-4 hover:border-4 focus:text-white hover:text-white
                   ${
                      isInCurrentMonth(day_date) ?
                      (
                        (isDaySelected(day_date)) ? 
                        "text-white border-white border-4 bg-green-900 active:bg-green-900"
                        :
                        "bg-green-100 text-black hover:bg-green-700 focus:bg-green-700"
                      )
                      :
                      (
                        (isDaySelected(day_date)) ? 
                        "text-white border-white border-4 bg-stone-600 active:bg-stone-600" 
                        :
                        "bg-stone-400 hover:bg-stone-500 focus:bg-stone-500 text-stone-700"
                      )
                    }`
                  }
                onClick={() => setSelectedDay(day_date)}
                onKeyUp={(event) => {
                    if (event.key === "Enter") setSelectedDay(day_date);
                  }
                }
            >
              {index === 0 && <span>{MonthFormattedStringMMM(getPrevMonthDate(month))}&nbsp;</span> }
              {index === days.length-trailingDays && <span>{MonthFormattedStringMMM(getNextMonthDate(month))}&nbsp;</span> }
              {day_date.date()}
            </div>
          ))}
        </div>
      </div>

      <div className={"order-3" + showEventsList ? "col-start-7 col-span-1" : ""}>
        { showEventsList && <EventsList/> }
      </div>
