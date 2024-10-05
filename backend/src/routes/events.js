const express = require("express");
const router = express.Router();
const { getAllEvents, getEventById, getEventByLabel, createEvent, modifyEvent, deleteEvent } = require("../controllers/eventsController.js")

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.get("/:label", getEventByLabel);

router.post("/", createEvent);

router.patch("/:event_id", modifyEvent);
router.delete("/:event_id", deleteEvent);

module.exports = router;
