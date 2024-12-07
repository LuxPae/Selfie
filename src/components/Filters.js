import { useEffect, useState, useContext } from "react"
import GlobalContext from "../context/GlobalContext.js"
import * as colors from "../scripts/COLORS.js"

export default function Filters()
{
  var { filters, setFilters } = useContext(GlobalContext)
  const [ showFilters, setShowFilters ] = useState(false)

  const allFilters = () => {
    for (let label of Object.keys(filters)) {
      if (!filters[label]) return false;
    }
    return true;
  }

  useEffect(() => {
   if (!allFilters()) setShowFilters(true) 
  }, [filters])

  const handleResetFilters = () => {
    setShowFilters(false);
    const resetted_filters = { white: true, red: true, orange: true, yellow: true, green: true, cyan: true, blue: true };
    setFilters(resetted_filters);
  }

  const handleCheckboxChange = (filter_label) => {
    var updated_filters = {}
    for (let label of Object.keys(filters)) {
      updated_filters[label] = filter_label === label ? !filters[label] : filters[label]
    }
    setFilters(updated_filters)
  }

  const handleClearFilters = () => {
    const cleared_filters = { white: false, red: false, orange: false, yellow: false, green: false, cyan: false, blue: false };
    setFilters(cleared_filters);
  }

  return (
  <div className="flex items-center">
    { !showFilters ?
      <span onClick={() => setShowFilters(true)} className="-translate-y-1 cursor-pointer material-symbols-outlined">filter_alt</span>
      :
      <>
      <div className="flex md:flex-row-reverse">
        <span onClick={handleResetFilters} className="-translate-y-1 cursor-pointer material-symbols-outlined">filter_alt_off</span>
        <span className="mx-3 flex items-center space-x-2">
          {colors.labelsNames.map((label, i) => (
            <div key={i} className={`${!filters[label] && colors.labelsBackground[label]}`}>
              <input
                type="checkbox"
                checked={filters[label]}
                onChange={() => handleCheckboxChange(label)}
                className={`w-5 h-5 ${colors.labelsAccent[label]} cursor-pointer`}
              />
            </div>
            ))}
        </span>
        <span title="togli tutti" className="flex items-start -translate-y-[2px] cursor-pointer material-symbols-outlined" onClick={handleClearFilters}>clear_all</span>
      </div>
      </>
    }
  </div>
  )
}
