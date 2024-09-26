const getUser = require("./userController.js");
const Event = require("../models/Event.js");

exports.getAllEvents = async (req, res) => {
  console.log("\nFetching all calendar events");
  try {
    const events = await Event.find({ userID: req.user._id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message+" could not fetch all events" });
  }
}

exports.getEventById = async (req, res) => {
  console.log("TODO getEventById");
}

exports.getEventByLabel = async (req, res) => {
  console.log("\nTODO getEventByLabel");
}

exports.createEvent = async (req, res) => {
  console.log("\nCreating event:", req.body);
  console.log(req.user);

  var event = {
    users: [req.user.id],
    ...req.body
  }
  console.log("Double check event:", event);

  const created_event = await new Event(event);
  console.log("Triple check event:", created_event);


  try {
    const newEvent = await created_event.save();
    if (!newEvent) throw new Error("Could not create event")
    res.status(201).json(newEvent);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
}

exports.modifyEvent = async (req, res) => {
  console.log("\nModifying event");
  try {
    console.error("TODO: modify calendar event");
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}

exports.deleteEvent = async (req, res) => {
  console.log("\nDeleting event");
  try {
    console.error("TODO: delete calendar event");
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}
