const express = require("express");
const router = express.Router();
const { getAllEvents, getEventById, getEventsByLabel, createEvent, modifyEvent, deleteEvent } = require("../controllers/eventsController.js")

router.get("/:user_id", getAllEvents);
router.get("/:user_id/:event_id", getEventById);
router.get("/:user_id/:label", getEventsByLabel);

router.post("/:user_id", createEvent);

router.patch("/:event_id", modifyEvent);
router.delete("/:event_id", deleteEvent);

module.exports = router;
