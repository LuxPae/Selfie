const is_uppercase = (ch) => {
  let n = ch.charCodeAt(0);
  return (n >= 65 && n <= 90);
}

const is_lowercase = (ch) => {
  let n = ch.charCodeAt(0);
  return (n >= 97 && n <= 122);
}

const is_number = (ch) => {
  let n = ch.charCodeAt(0);
  return (n >= 48 && n <= 57);
}

const is_valid_username = (ch) => {
  return (is_lowercase(ch) || is_uppercase(ch) || is_number(ch) || ch === "_")
}

const is_valid_fullName = (ch) => {
  return (is_lowercase(ch) || is_uppercase(ch) || is_number(ch) || ch === " ")
}

// Exports

export const validateUsername = (username) => {
  validateUsernameLength(username)
  for (let ch of username) {
    if (!is_valid_username(ch)) throw new Error(`Carattere non valido nel nome utente: ${ch}`);
  }
}

export const validateUsernameLength = (username) => {
  if (username.length < 3) throw new Error("Nome utente troppo corto, deve essere lungo almeno 3 caratteri")
  else if (username.length > 20) throw new Error("Nome utente troppo lungo, può essere lungo massimo 20 caratteri")
}

export const validateFullName = (fullName) => {
  validateFullNameLength(fullName)
  for (let ch of fullName) {
    if (!is_valid_fullName(ch)) throw new Error(`Carattere non valido nel nome completo: ${ch}`);
  }
}

export const validateFullNameLength = (fullName) => {
  if (fullName.length < 7) throw new Error("Nome completo troppo corto, deve essere lungo almeno 7 caratteri")
  else if (fullName.length > 40) throw new Error("Nome completo troppo lungo, può essere lungo massimo 40 caratteri")
}

export const validateUser = (user) => {
  validateUsername(user.username) 
  validateFullName(user.fullName)
}
