const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getUser, getUserById, modifyUser, deleteUser } = require("../controllers/userController.js")

router.get("/profile/:_id", getUserById);
router.get("/profile", auth, getUser);
//TODO solo per testare poi devo aggiungere di nuovo il middleware auth
router.patch("/profile", modifyUser);
router.delete("/profile", auth, deleteUser);

//TODO vorrei farlo così:
// router.get("/", getAllUsers);
// router.get("/:id", getUserById);
// ... senza profile che è inutile

module.exports = router;
