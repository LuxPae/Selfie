/// PASSWORD

const validatePasswordEmpty = (password) => {
  if (password.length === 0) return "Inserisci la password"
}
const validatePasswordMinLength = (password) => {
  if (password.length < 8) return "Password non valida: deve essere lunga almeno 8 caratteri"
}
const validatePasswordMaxLength = (password) => {
  if (password.length > 16) return "Password non valida: deve essere lunga meno di 16 caratteri"
}

export const validatePassword = (password) => {
  let error = ""
  if (error = validatePasswordEmpty(password)) return error
  if (error = validatePasswordMinLength(password)) return error
  if (error = validatePasswordMaxLength(password)) return error
  return error
}
/// ~ PASSWORD

/// EMAIL

const validateEmailEmpty = (email) => {
  if (email.length === 0) return "Inserisci l'email"
}

const validateEmailAt = (email) => {
  let index = email.indexOf('@')
  if (index == -1) return "Email non valida: manca la chioccioletta"
}

const validateEmailDot = (email) => {
  let index = email.indexOf('.')
  if (index == -1) return "Email non valida: manca il punto"
}

const validateEmailAtBeforeDot = (email) => {
  let at_index = email.indexOf('@')
  let dot_index = email.indexOf('.')
  if (dot_index <= at_index) return "Email non valida: il punto deve essere dopo la chioccioletta"
}

const validateEmailContent = (email) => {
  const split_at = email.split('@')
  if (split_at[0].length === 0) return "Email non valida: non c'è nulla prima della chioccioletta"
  const split_dot = split_at[1].split('.')
  if (split_dot[0].length === 0) return "Email non valida: non c'è nulla tra il punto e la chioccioletta"
  if (split_dot[1].length === 0) return "Email non valida: non c'è nulla dopo il punto"
}

export const validateEmail = (email) => {
  let error = ""
  if (error = validateEmailEmpty(email)) return error
  if (error = validateEmailAt(email)) return error
  if (error = validateEmailDot(email)) return error
  if (error = validateEmailAtBeforeDot(email)) return error
  if (error = validateEmailContent(email)) return error
  return error
}
/// ~ EMAIL

/// USERNAME 
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
const is_valid_char_in_username = (ch) => {
  return (is_lowercase(ch) || is_uppercase(ch) || is_number(ch) || ch === "_")
}
const is_valid_char_in_fullName = (ch) => {
  return (is_lowercase(ch) || is_uppercase(ch) || is_number(ch) || ch === " ")
}

const validateUsernameEmpty = (username) => {
  if (username.length === 0) return "Inserisci il nome utente"
}
const validateUsernameMinLength = (username) => {
  if (username.length < 3) return "Il nome utente deve essere lungo almeno 3 caratteri"
}
const validateUsernameMaxLength = (username) => {
  if (username.length > 20) return "Il nome utente non può superare i 20 caratteri"
}
const validateUsernameChars = (username) => {
  for (let ch of username) {
    if (!is_valid_char_in_username(ch)) return `Carattere non valido nel nome utente: '${ch}'`
  }
}
const validateUsername = (username) => {
  let error = ""
  if (error = validateUsernameEmpty(username)) return error
  if (error = validateUsernameMaxLength(username)) return error
  if (error = validateUsernameMinLength(username)) return error
  if (error = validateUsernameChars(username)) return error
  return error
}
/// ~ USERNAME

/// FULLNAME
const validateFullNameEmpty = (fullName) => {
  if (fullName.length === 0) return "Inserisci il nome completo"
}
const validateFullNameMinLength = (fullName) => {
  if (fullName.length < 3) return "Il nome completo deve essere lungo almeno 3 caratteri"
}
const validateFullNameMaxLength = (fullName) => {
  if (fullName.length > 20) return "Il nome completo non può superare i 20 caratteri"
}
const validateFullNameChars = (fullName) => {
  for (let ch of fullName) {
    if (!is_valid_char_in_fullName(ch)) return `Carattere non valido nel nome completo: '${ch}'`
  }
}

const validateFullName = (fullName) => {
  let error = ""
  if (error = validateFullNameEmpty(fullName)) return error
  if (error = validateFullNameMaxLength(fullName)) return error
  if (error = validateFullNameMinLength(fullName)) return error
  if (error = validateFullNameChars(fullName)) return error
  return error
}
/// ~ FULLNAME

// Login
export const validateLogin = (loginData) => {
  let error = ""
  if (error = validateEmail(loginData.email)) return error
  if (error = validatePassword(loginData.password)) return error
  return error
}

// Registration
export const validateRegistration = (registrationData) => {
  let error = ""
  if (error = validateEmail(registrationData.email)) return error
  if (error = validatePassword(registrationData.password)) return error
  if (error = validateFullName(registrationData.fullName)) return error
  if (error = validateUsername(registrationData.username)) return error
  return error
}

// Modified
export const validateModifiedUser = (modifiedData) => {
  let error = ""
  if (error = validateFullName(modifiedData.fullName)) return error
  if (error = validateUsername(modifiedData.username)) return error
  return error
}
