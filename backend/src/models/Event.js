const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  id: { 
    type: String, 
    required: true 
  },
  title: {
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: true 
  },
  label: { 
    type: String, 
    required: true 
  },
  date: {
    type: Number,
    required: true
  },
  allDay: {
    type: Boolean,
    required: true,
    default: false,
  },
  duration: {
    type: Number,
    required: true,
    default: 1,
  },
  begin: { 
    type: Number, 
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
  repeated: {
  type: Boolean,
  default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
