const mongoose = require("mongoose");
const dayjs = require("dayjs")

const eventSchema = new mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  title: {
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: false 
  },
  label: { 
    type: String, 
    required: false,
    default: "white"
  },
  allDay: {
    type: Boolean,
    required: true,
    default: false,
  },
  begin: { 
    type: Number, 
    required: true,
    default: dayjs().valueOf()
  },
  end: {
    type: Number,
    required: true,
    default: dayjs().valueOf()
  },
  repeated: {
    type: Boolean,
    default: false
  },
  repeatedData: {
    rep_id: String,
    every: { type: String, default: "week" },
    type: { type: String, default: "endsAfter" },
    endsOn: { type: Number, default: dayjs().valueOf() },
    endsAfter: { type: Number, default: 1}
  }

}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
