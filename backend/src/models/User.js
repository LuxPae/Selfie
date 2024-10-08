const mongoose = require('mongoose');

const validateEmail = {
  validator: v => {
    return (v.includes('@') && v.includes('.'))
  },
  message: props => `${props.value} non è un indirizzo email`
}

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

const validateUsername = {
  validator: v => {
    for (let ch in v) {
      if (!is_valid_char_in_username(ch)) return false;
    }
    return true;
  },
  message: props => `Carattere non valido nello username ${props.value}`
}

const validateFullName = {
  validator: v => {
    for (let ch in v) {
      if (!is_valid_char_in_fullName(ch)) return false;
    }
    return true;
  },
  message: props => `Carattere non valido nel nome completo ${props.value}`
}

const userSchema = new mongoose.Schema({
  email: { 
    type: String,
    lowercase: true, 
    required: [true, "Email necessaria"],
    unique: true,
    validate: validateEmail
  },
  password: {
    type: String,
    required: [true, "Password necessaria"],
    minLength: [8, "La password deve essere lunga almeno 8 caratteri"]
  },
  username: {
    type: String,
    required: [true, "Nome utente necessario"],
    validate: validateUsername
  },
  fullName: {
    type: String, 
    default: "Nuovo Utente",
    validate: validateFullName
  },
  picture: {
    type: String,
    default: "https://img.freepik.com/premium-photo/sloth-touches-camera-taking-selfie-funny-selfie-portrait-animal_323015-1968.jpg?w=360" 
  },
  bio: {
    type: String, 
    default: "Benvenuto nella tua area personale: scrivi qualcosa su di te!"
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
