const Message = require("../models/Message");
const Room = require("../models/Room");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRoom = async (req, res) => {
  const { name, description } = req.body;
  try {
    const roomExists = await Room.findOne({ name });
    if (roomExists) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = await Room.create({ name, description });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ room: roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, createRoom, getMessages };
