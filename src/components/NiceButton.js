
export default function NiceButton({ text, colour, when_clicked, extra }) {

  const colourVariants = {
    red: "text-red-400 border-red-200 hover:bg-red-600 focus:ring-red-600",
    green: "text-green-400 border-green-200 hover:bg-green-600 focus:ring-green-600",
    blue: "text-blue-400 border-blue-200 hover:bg-blue-600 focus:ring-blue-600",
  }
  return <button type="button" className={`${colourVariants[colour]} mb-3 mr-2 px-4 py-1 text-sm font-semibold rounded-full border hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 flex content-center`} onClick={when_clicked}>{text}{extra}
  </button>

}
