const express = require("express");
const {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getTours);
router.get("/:id", getTourById);
router.post("/", protect, adminOnly, createTour);
router.put("/:id", protect, adminOnly, updateTour);
router.delete("/:id", protect, adminOnly, deleteTour);

module.exports = router;
