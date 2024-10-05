const express = require("express");
const router = express.Router();
const { getCurrentUser, getUser, getUserById, modifyUser, deleteUser } = require("../controllers/userController.js")

router.get("/profile/:_id", getUserById);
//router.get("/profile", auth, getUser);
router.get("/profile", getUser);
router.patch("/profile", modifyUser);
router.delete("/profile/:_id", deleteUser);

//TODO vorrei farlo così:
// router.get("/", getAllUsers);
// router.get("/:id", getUserById);
// ... senza profile che è inutile

module.exports = router;
