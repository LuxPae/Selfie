const express = require("express");
const router = express.Router();
const {getNotes, postNote, getNoteById, putNoteById, deleteNote} = require("../controllers/noteController.js");

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", postNote);
router.put("/:id", putNoteById);
router.delete("/:id", deleteNote);

module.exports = router;
