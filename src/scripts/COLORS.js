// ho pensato che al posto di variabili singole posso fare degli oggetti del tipo:
// export const MAIN = {
//   BG: {
//     LIGHT: "...",
//     MEDIUM: "...",
//     DARK: "...",
//   },
//   BORDER: {
//     LIGHT: "...",
//     MEDIUM: "...",
//     DARK: "...",
//   },
//   etc...
// }
//
// così è più organizzato
// Purtroppo non verrà fatto :(

export const colors = {
  BG: {
    LIGHT: {
      th_purple: ""
    },
    MEDIUM: {
      th_purple: ""
    },
    DARK: {
      th_purple: ""
    }
  }
}


/// main COLORS
export const MAIN_BG_LIGHT = "bg-zinc-400"
export const MAIN_BG_MEDIUM = "bg-zinc-800"
export const MAIN_BG_DARK = "bg-zinc-900" // #18181b
export const MAIN_BORDER_DARK = "border-zinc-900"
export const MAIN_BORDER_LIGHT = "border-neutral-400"
export const MAIN_TEXT_LIGHT = "text-zinc-200"
export const MAIN_TEXT_MEDIUM = "text-zinc-500"
export const MAIN_TEXT_DARK = "text-zinc-700"
export const MAIN_HOVER_TEXT = "md:hover:text-zinc-400"
export const INVERTED_HOVER_TEXT = "md:hover:text-zinc-700"

/// calendars COLORS
export const CALENDAR_BG_LIGHT = "bg-zinc-600"
export const CALENDAR_BG_MEDIUM = "bg-neutral-700"
export const CALENDAR_BG_DARK = "bg-zinc-800"
export const CALENDAR_ACTIVE_BG_DARK = CALENDAR_BG_DARK
export const CALENDAR_HOVER_BG_DARK = "md:hover:bg-zinc-700"
export const CALENDAR_FOCUS_BG_DARK = "md:focus:bg-zinc-700"

/// buttons COLORS
export const BUTTON_BG = "bg-zinc-500"
export const BUTTON_HOVER_BG = "md:hover:bg-zinc-600"
export const BUTTON_FOCUS_BG = "md:focus:bg-zinc-600"
export const BUTTON_TEXT = "text-white"

/// error COLORS
export const ERROR_TEXT = "text-red-500"

/// other COLORS
export const HOME_GRADIENT_1 = "from-zinc-700"
export const HOME_GRADIENT_2 = "to-zinc-900"

/// LABELS
export const labelsNames = ["white", "red", "orange", "yellow", "green", "cyan", "blue"]

const white  = "white"
const red    = "red-600"
const orange = "orange-500"
const yellow = "yellow-400"
const green  = "green-500"
const cyan   = "cyan-400"
const blue   = "blue-600"

export const labelsAccent = {
  white: "accent-white",
  red: "accent-red-600",
  orange: "accent-orange-500",
  yellow: "accent-yellow-400",
  green: "accent-green-500",
  cyan: "accent-cyan-400",
  blue: "accent-blue-600"
}
export const labelsText = {
  white: "text-white",
  red: "text-red-600",
  orange: "text-orange-500",
  yellow: "text-yellow-400",
  green: "text-green-500",
  cyan: "text-cyan-400",
  blue: "text-blue-600"
}
export const labelsBackground = {
  white: "bg-white",
  red: "bg-red-600",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  cyan: "bg-cyan-400",
  blue: "bg-blue-600"
}
export const labelsBorder = {
  white: "border-white",
  red: "border-red-600",
  orange: "border-orange-500",
  yellow: "border-yellow-400",
  green: "border-green-500",
  cyan: "border-cyan-400",
  blue: "border-blue-600"
}
export const labelsTextContrast = {
  white: "text-black",
  red: "text-white",
  orange: "text-black",
  yellow: "text-black",
  green: "text-black",
  cyan: "text-black",
  blue: "text-white"
}
export const labelsBorderContrast = {
  white: "border-black",
  red: "border-white",
  orange: "border-black",
  yellow: "border-black",
  green: "border-black",
  cyan: "border-black",
  blue: "border-white"
}

export const primaryColor = '#BA455F';
export const primaryColorEndGradient = '#9C2E47';

export const greenColor = '#147917';
export const greenColorEndGradient = '#106113';

export const yellowColor = 'rgba(255,215,0,0.85)';
export const yellowColorEndGradient = 'rgba(255,215,0,0.6)';

export const blueColor = 'rgba(3,134,208,0.5)';
export const blueColorEndGradient = 'rgba(14,158,227,0.2)';

export const grey = "#8A8A8A";
export const background = "#2b2b2b";
