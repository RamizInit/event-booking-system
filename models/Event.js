const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
