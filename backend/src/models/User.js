const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String,
    lowercase: true, 
    required: [true, "Email necessaria"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password necessaria"],
    minLength: [8, "La password deve essere lunga almeno 8 caratteri"]
  },
  username: {
    type: String,
    required: [true, "Nome utente necessario"]
  },
  fullName: {
    type: String, 
    default: "Nuovo Utente"
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
