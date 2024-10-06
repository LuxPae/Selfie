//        {days.map((day_date, index) => (
//          <>
//          <div
//            key={index}
//            tabIndex="0"
//            style={{height: day_tile_height()}}
//            className={
//              `h-16 flex items-left justify-between px-1 rounded-lg focus:border-white hover:border-white focus:border-4 hover:border-4 focus:text-white hover:text-white
//               ${
//                  isInCurrentMonth(day_date) ?
//                  (
//                    (isDaySelected(day_date)) ? 
//                    "text-white border-white border-4 bg-green-900 active:bg-green-900"
//                    :
//                    "bg-green-100 text-black hover:bg-green-700 focus:bg-green-700"
//                  )
//                  :
//                  (
//                    (isDaySelected(day_date)) ? 
//                    "text-white border-white border-4 bg-stone-600 active:bg-stone-600" 
//                    :
//                    "bg-stone-400 hover:bg-stone-500 focus:bg-stone-500 text-stone-700"
//                  )
//                }`
//              }
//            onClick={() => setSelectedDay(day_date)}
//          >
//            {day_date.date()}
//            {index === 0 && <span className="text-sm justify-end">{MonthFormattedStringMMM(getPrevMonthDate(month))}&nbsp;</span> }

//          </div>
//          </>
//        ))}
//        </div>
//      </div>
//      </div>
//      </div>
//      </>
//  );
//};
