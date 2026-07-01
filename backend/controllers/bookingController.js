const Booking = require("../models/Booking");
const TourPackage = require("../models/TourPackage");

async function getUserBookings(req, res) {
  try {
    if (req.user.id !== req.params.userId) return res.status(403).json({ message: "Not authorized" });
    const bookings = await Booking.find({ user: req.params.userId }).populate("tour", "title destination price images").sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find({}).populate("user", "name email").populate("tour", "title destination").sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    if (booking.status === "cancelled") return res.status(400).json({ message: "Already cancelled" });
    booking.status = "cancelled";
    await booking.save();
    await TourPackage.findByIdAndUpdate(booking.tour, { $inc: { bookedSlots: -booking.numberOfTravelers } });
    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getUserBookings, getAllBookings, cancelBooking };
