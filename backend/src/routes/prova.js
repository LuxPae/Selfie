const express = require("express")
const router = express.Router();
const { provami } = require("../controllers/provaController.js");

router.get("/", provami);

module.exports = router;
