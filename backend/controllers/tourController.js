const TourPackage = require("../models/TourPackage");

// GET /api/tours  (supports ?destination=, ?minPrice=, ?maxPrice=)
async function getTours(req, res) {
  try {
    const { destination, minPrice, maxPrice } = req.query;
    const filter = {};

    if (destination) filter.destination = new RegExp(destination, "i");

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const tours = await TourPackage.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// GET /api/tours/:id
async function getTourById(req, res) {
  try {
    const tour = await TourPackage.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// POST /api/tours  (admin only)
async function createTour(req, res) {
  try {
    const tour = await TourPackage.create(req.body);
    res.status(201).json(tour);
  } catch (err) {
    res.status(400).json({ message: "Invalid tour data", error: err.message });
  }
}

// PUT /api/tours/:id  (admin only)
async function updateTour(req, res) {
  try {
    const tour = await TourPackage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json(tour);
  } catch (err) {
    res.status(400).json({ message: "Invalid update", error: err.message });
  }
}

// DELETE /api/tours/:id  (admin only)
async function deleteTour(req, res) {
  try {
    const tour = await TourPackage.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json({ message: "Tour deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getTours, getTourById, createTour, updateTour, deleteTour };
