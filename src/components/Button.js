import * as colors from "../scripts/COLORS.js"

export default function Button({ otherCss, click, label, submit })
{
  const type = submit ? "submit" : "button"
  return <button type={type} className={`px-2 py-1 rounded ${colors.BUTTON_BG} ${colors.BUTTON_HOVER_BG} ${colors.BUTTON_FOCUS_BG} ${colors.BUTTON_TEXT} ${otherCss}`} onClick={click}>{label}</button>
}
