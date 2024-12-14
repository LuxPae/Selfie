const express = require("express");
const router = express.Router();
const {getAllTimers, getTimerById, postTimer, putTimer, deleteTimer} = require("../controllers/timerController.js");
const {getLastTimer} = require("../controllers/timerController");

router.get("/", getAllTimers);
router.get("/last", getLastTimer);
router.get("/:id", getTimerById);
router.post("/", postTimer);
router.put("/:id", putTimer);
router.delete("/:id", deleteTimer);

module.exports = router;
