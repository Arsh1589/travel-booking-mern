const Review = require("../models/Review");
const Booking = require("../models/Booking");

async function createReview(req, res) {
  try {
    const { tourId, rating, comment } = req.body;
    const confirmedBooking = await Booking.findOne({ user: req.user.id, tour: tourId, status: "confirmed" });
    if (!confirmedBooking) return res.status(403).json({ message: "You can only review tours you have booked." });
    const existing = await Review.findOne({ user: req.user.id, tour: tourId });
    if (existing) return res.status(400).json({ message: "You have already reviewed this tour." });
    const review = await Review.create({ user: req.user.id, tour: tourId, rating, comment });
    const populated = await review.populate("user", "name");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getTourReviews(req, res) {
  try {
    const reviews = await Review.find({ tour: req.params.tourId }).populate("user", "name").sort({ createdAt: -1 });
    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;
    res.status(200).json({ reviews, avgRating, totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { createReview, getTourReviews };
