const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");

router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.post("/:id/toggle-visibility", roomController.toggleVisibility);

module.exports = router;