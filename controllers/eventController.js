const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  const { name, date, capacity } = req.body;
  if (!name || !date || !capacity)
    return res.status(400).json({ message: "All fields required" });

  const event = await Event.create({
    name,
    date,
    capacity,
    availableSeats: capacity,
  });
  res.status(201).json(event);
};

// Get Events with filter & pagination
exports.getEvents = async (req, res) => {
  const { start, end, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (start && end)
    filter.date = { $gte: new Date(start), $lte: new Date(end) };

  const events = await Event.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ date: 1 });

  const total = await Event.countDocuments(filter);
  res
    .status(200)
    .json({ total, page: parseInt(page), limit: parseInt(limit), events });
};

// Update Event
exports.updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const { name, date, capacity } = req.body;
  if (name) event.name = name;
  if (date) event.date = date;
  if (capacity) {
    const bookedSeats = event.capacity - event.availableSeats;
    if (capacity < bookedSeats)
      return res
        .status(400)
        .json({ message: "Capacity cannot be less than booked seats" });
    event.capacity = capacity;
    event.availableSeats = capacity - bookedSeats;
  }

  await event.save();
  res.status(200).json(event);
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  await event.remove();
  res.status(200).json({ message: "Event deleted successfully" });
};
