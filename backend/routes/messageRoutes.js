const express = require("express");
const router = express.Router();
const {
  getRooms,
  createRoom,
  getMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.get("/rooms", protect, getRooms);
router.post("/rooms", protect, createRoom);
router.get("/messages/:roomId", protect, getMessages);

module.exports = router;
