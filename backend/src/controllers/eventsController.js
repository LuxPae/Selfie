const getUser = require("./userController.js");
const Event = require("../models/Event.js");

exports.getAllEvents = async (req, res) => {
  console.log("\nFetching all calendar events");
  try {
    const events = await Event.find({ users: req.user });
    res.status(200).json(events);
    console.log("> Success");
  } catch (err) {
    console.log("x Error");
    res.status(500).json({ message: err.message+" could not fetch all events" });
  }
}

exports.getEventById = async (req, res) => {
  console.log("\nFetching calendar event", req.params.event_id);
  try {
    const event = await Event.find({ _id: req.params.event_id });
    if (!event) throw new Error("Event not found");
    res.status(200).json(events);
    console.log("> Success");
  } catch (err) {
    console.log("x Error");
    res.status(500).json({ message: err.message+" could not fetch event" });
  }
}

exports.getEventsByLabel = async (req, res) => {
  console.log("\nFetching events by label:", req.params.label);
  try {
    const events = await Event.find({ userID: req.params.user_id, label: req.params.label });
    res.status(200).json(events);
    console.log("> Success");
  } catch (err) {
    console.log("x Error");
    res.status(500).json({ message: err.message+" could not fetch events" });
  }
}

exports.createEvent = async (req, res) => {
  var event = { ...req.body };
  console.log("\nCreating event");
  try {
    const created_event = await new Event(event);

    const newEvent = await created_event.save();
    if (!newEvent) throw new Error("x Could not create event")
    res.status(201).json(newEvent);
    console.log("> Event created")
  }
  catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
}

exports.modifyEvent = async (req, res) => {
  console.log("\nModifying event", req.params.event_id);
  try {
    const modified_event = req.body.modified_event;
    const new_event = await Event.findOneAndUpdate({ _id: modified_event._id }, {...modified_event});
    if (!new_event) throw new Error("x Event could not be modified")
    const saved_event = await new_event.save();
    if (!saved_event) throw new Error("x Event could not be modified")
    console.log("> Event modified")
    res.status(200).json(modified_event);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
}

exports.deleteEvent = async (req, res) => {
  const id = req.params.event_id;
  console.log("\nDeleting event", id);
  try {
    const result = await Event.findByIdAndDelete(id); 
    if (result) {
      console.log("> Event deleted");
      res.status(204);
    }
    else throw new Error("x Event does not exist")
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}
